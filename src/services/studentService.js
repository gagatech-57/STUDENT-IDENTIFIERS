const bcrypt = require("bcrypt");
const { getModels, getDbStatus } = require("../config/db");

const getAllStudentsService = async () => {
    const { AtlasStudent, LocalStudent } = getModels();
    let atlasStudents = [];
    let localStudents = [];

    if (AtlasStudent) {
        try {
            atlasStudents = await AtlasStudent.find().sort({ studentId: 1 }).lean();
        } catch (e) {
            console.warn("Atlas get students warning:", e.message);
        }
    }

    if (LocalStudent) {
        try {
            localStudents = await LocalStudent.find().sort({ studentId: 1 }).lean();
        } catch (e) {
            console.warn("Local get students warning:", e.message);
        }
    }

    const studentMap = new Map();

    atlasStudents.forEach(s => {
        s.locations = ["Online Atlas"];
        studentMap.set(s.studentId, s);
    });

    localStudents.forEach(s => {
        if (studentMap.has(s.studentId)) {
            const existing = studentMap.get(s.studentId);
            if (!existing.locations.includes("Local MongoDB")) {
                existing.locations.push("Local MongoDB");
            }
        } else {
            s.locations = ["Local MongoDB"];
            studentMap.set(s.studentId, s);
        }
    });

    return Array.from(studentMap.values()).sort((a, b) => a.studentId.localeCompare(b.studentId));
};

const getStudentByIdService = async (studentId) => {
    const { AtlasStudent, LocalStudent } = getModels();
    let student = null;

    if (AtlasStudent) {
        student = await AtlasStudent.findOne({ studentId });
    }
    if (!student && LocalStudent) {
        student = await LocalStudent.findOne({ studentId });
    }

    if (!student) {
        const error = new Error("Student Not Found");
        error.statusCode = 404;
        throw error;
    }
    return student;
};

const createStudentService = async ({ name, age, department, email, password }) => {
    const pwd = password || "";
    if (pwd.length < 5 || pwd.length > 72) {
        const error = new Error("Password must be between 5 and 72 characters");
        error.statusCode = 400;
        throw error;
    }

    const { AtlasStudent, LocalStudent } = getModels();
    let count = 0;
    if (AtlasStudent) {
        count = await AtlasStudent.countDocuments();
    } else if (LocalStudent) {
        count = await LocalStudent.countDocuments();
    }

    const hashedPassword = await bcrypt.hash(pwd, 10);
    const studentData = {
        studentId: String(count + 1).padStart(2, "0"),
        name: name.trim().toUpperCase(),
        age: Number(age),
        department: department.trim().toUpperCase(),
        email: email.toLowerCase().trim(),
        password: hashedPassword
    };

    let createdAtlas = null;
    let createdLocal = null;

    if (AtlasStudent) {
        try {
            createdAtlas = await AtlasStudent.create(studentData);
        } catch (e) {
            console.warn("Atlas student creation warning:", e.message);
        }
    }

    if (LocalStudent) {
        try {
            const existing = await LocalStudent.findOne({ studentId: studentData.studentId });
            if (!existing) {
                createdLocal = await LocalStudent.create(studentData);
            } else {
                createdLocal = existing;
            }
        } catch (e) {
            console.warn("Local student creation warning:", e.message);
        }
    }

    const finalStudent = createdAtlas || createdLocal || studentData;

    return {
        message: "Student Added Successfully to Dual MongoDB!",
        student: finalStudent
    };
};

const updateStudentService = async (studentId, { name, age, department, email }) => {
    const { AtlasStudent, LocalStudent } = getModels();
    let updatedAtlas = null;
    let updatedLocal = null;

    const updatePayload = {};
    if (name) updatePayload.name = name.trim().toUpperCase();
    if (age) updatePayload.age = Number(age);
    if (department) updatePayload.department = department.trim().toUpperCase();
    if (email) updatePayload.email = email.toLowerCase().trim();

    if (AtlasStudent) {
        updatedAtlas = await AtlasStudent.findOneAndUpdate(
            { studentId },
            updatePayload,
            { new: true, runValidators: true }
        );
    }

    if (LocalStudent) {
        updatedLocal = await LocalStudent.findOneAndUpdate(
            { studentId },
            updatePayload,
            { new: true, runValidators: true }
        );
    }

    const student = updatedAtlas || updatedLocal;
    if (!student) {
        const error = new Error("Student Not Found");
        error.statusCode = 404;
        throw error;
    }

    return {
        message: "Student Updated Successfully in Dual MongoDB",
        student
    };
};

const deleteStudentService = async (studentId) => {
    const { AtlasStudent, LocalStudent } = getModels();
    let deletedAtlas = null;
    let deletedLocal = null;

    if (AtlasStudent) {
        deletedAtlas = await AtlasStudent.findOneAndDelete({ studentId });
    }
    if (LocalStudent) {
        deletedLocal = await LocalStudent.findOneAndDelete({ studentId });
    }

    if (!deletedAtlas && !deletedLocal) {
        const error = new Error("Student Not Found");
        error.statusCode = 404;
        throw error;
    }

    return {
        message: "Student Deleted Successfully from Dual MongoDB"
    };
};

const syncStudentsService = async () => {
    const { AtlasStudent, LocalStudent } = getModels();

    if (!AtlasStudent || !LocalStudent) {
        return {
            success: false,
            message: "Cannot sync students: one or both databases are disconnected.",
            dbStatus: getDbStatus()
        };
    }

    const atlasStudents = await AtlasStudent.find().lean();
    const localStudents = await LocalStudent.find().lean();

    const localEmails = new Set(localStudents.map(s => s.email));
    const atlasEmails = new Set(atlasStudents.map(s => s.email));

    let syncedToLocal = 0;
    let syncedToAtlas = 0;

    for (const s of atlasStudents) {
        if (!localEmails.has(s.email)) {
            const cleanDoc = { ...s };
            delete cleanDoc._id;
            delete cleanDoc.__v;
            await LocalStudent.create(cleanDoc);
            syncedToLocal++;
        }
    }

    for (const s of localStudents) {
        if (!atlasEmails.has(s.email)) {
            const cleanDoc = { ...s };
            delete cleanDoc._id;
            delete cleanDoc.__v;
            await AtlasStudent.create(cleanDoc);
            syncedToAtlas++;
        }
    }

    return {
        success: true,
        message: `Student sync complete! Synced ${syncedToLocal} students to Local DB and ${syncedToAtlas} students to Online Atlas.`,
        syncedToLocal,
        syncedToAtlas
    };
};

module.exports = {
    getAllStudentsService,
    getStudentByIdService,
    createStudentService,
    updateStudentService,
    deleteStudentService,
    syncStudentsService
};
