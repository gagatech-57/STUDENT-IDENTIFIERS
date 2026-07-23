function formatStudentResponse(student) {
    return {
        studentId: student.studentId,
        name: student.name,
        age: student.age,
        department: student.department,
        email: student.email
    };
}

module.exports = formatStudentResponse;
