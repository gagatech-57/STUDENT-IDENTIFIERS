const API = "http://localhost:3000";
const { createElement: h, useEffect, useState } = React;

function LoginForm({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (email.trim() === "" || password.trim() === "") {
            setError("Please enter Email & Password");
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            onLogin(data.student, data.token);
        } catch (err) {
            setError("Server Connection Failed");
        } finally {
            setIsLoading(false);
        }
    }

    return h(
        "section",
        { className: "login-box" },
        h("h1", null, "Student Login"),
        h(
            "form",
            { onSubmit: handleSubmit },
            h(
                "div",
                { className: "input-box" },
                h("i", { className: "fa fa-envelope" }),
                h("input", {
                    type: "email",
                    value: email,
                    placeholder: "Enter Email",
                    onChange: (event) => setEmail(event.target.value)
                })
            ),
            h(
                "div",
                { className: "input-box" },
                h("i", { className: "fa fa-lock" }),
                h("input", {
                    type: "password",
                    value: password,
                    placeholder: "Enter Password",
                    onChange: (event) => setPassword(event.target.value)
                })
            ),
            h(
                "button",
                {
                    type: "submit",
                    disabled: isLoading
                },
                isLoading ? "Logging in..." : "Login"
            ),
            h("p", { id: "error" }, error)
        )
    );
}

function StudentDashboard({ student, onLogout }) {
    return h(
        "section",
        { className: "profile-box" },
        h(
            "header",
            { className: "profile-header" },
            h(
                "div",
                null,
                h("span", { className: "profile-kicker" }, "Student Portal"),
                h("h1", null, "Profile Dashboard")
            ),
            h("span", { className: "status-pill" }, "Active")
        ),
        h(
            "div",
            { className: "profile-panel" },
            h(
                "div",
                { className: "profile-hero" },
                h(
                    "div",
                    { className: "student-avatar" },
                    h("i", { className: "fa-solid fa-user-graduate" })
                ),
                h(
                    "div",
                    { className: "student-summary" },
                    h("span", { className: "student-id" }, `ID ${student.studentId}`),
                    h("h2", null, student.name),
                    h("p", null, student.email)
                )
            ),
            h(
                "div",
                { className: "detail-grid" },
                h(InfoTile, {
                    icon: "fa-solid fa-id-card",
                    label: "Student ID",
                    value: student.studentId
                }),
                h(InfoTile, {
                    icon: "fa-solid fa-building-columns",
                    label: "Department",
                    value: student.department
                }),
                h(InfoTile, {
                    icon: "fa-solid fa-calendar",
                    label: "Age",
                    value: student.age
                }),
                h(InfoTile, {
                    icon: "fa-solid fa-envelope",
                    label: "Email",
                    value: student.email
                })
            ),
            h(UploadTestCard, null),
            h(
                "div",
                { className: "profile-footer" },
                h("div", { className: "barcode" }),
                h(
                    "button",
                    {
                        id: "logoutBtn",
                        type: "button",
                        onClick: onLogout
                    },
                    "Logout"
                ),
                h("span", { className: "profile-code" }, "COSMIC ACCESS")
            )
        )
    );
}

function UploadTestCard() {
    const [file, setFile] = useState(null);
    const [uploadMsg, setUploadMsg] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [savedFiles, setSavedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        fetchStoredFiles();
    }, []);

    async function fetchStoredFiles() {
        try {
            const res = await fetch(`${API}/upload/files`);
            if (res.ok) {
                const data = await res.json();
                if (data.files) {
                    setSavedFiles(data.files);
                }
            }
        } catch (e) {
            console.error("Failed to fetch stored uploads from MongoDB:", e);
        }
    }

    async function handleUpload(event) {
        if (event) event.preventDefault();
        setUploadMsg("");

        if (!file) {
            setUploadMsg("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("photo", file);

        try {
            setIsUploading(true);
            const response = await fetch(`${API}/upload`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                setUploadMsg(data.message || "Upload failed");
            } else {
                setUploadMsg(data.message || "Upload successful!");
                setFile(null);
                const fileInput = document.getElementById("uploadInput");
                if (fileInput) fileInput.value = "";
                fetchStoredFiles();
            }
        } catch (err) {
            setUploadMsg("Server connection error during upload");
        } finally {
            setIsUploading(false);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave() {
        setIsDragging(false);
    }

    return h(
        "div",
        { className: "upload-box" },
        h("div", { className: "upload-header" },
            h("h3", null, h("i", { className: "fa-solid fa-cloud-arrow-up" }), " File & Image Upload"),
            h("span", { className: "mongo-badge" }, h("i", { className: "fa-solid fa-database" }), " MongoDB Connected")
        ),
        h(
            "form",
            { onSubmit: handleUpload, className: "upload-form" },
            h(
                "div",
                {
                    className: `dropzone ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`,
                    onDrop: handleDrop,
                    onDragOver: handleDragOver,
                    onDragLeave: handleDragLeave,
                    onClick: () => document.getElementById("uploadInput").click()
                },
                h("input", {
                    type: "file",
                    id: "uploadInput",
                    style: { display: "none" },
                    onChange: (e) => setFile(e.target.files[0])
                }),
                h("i", { className: file ? "fa-solid fa-file-circle-check drop-icon success" : "fa-solid fa-cloud-arrow-up drop-icon" }),
                file
                    ? h("div", { className: "selected-file-info" },
                        h("strong", null, file.name),
                        h("span", null, `${(file.size / 1024).toFixed(1)} KB • Click to change`)
                    )
                    : h("div", { className: "drop-text" },
                        h("strong", null, "Click or drag a file to upload"),
                        h("span", null, "Supports JPG, PNG, WEBP, GIF, PDF, DOCX (Max 10MB)")
                    )
            ),
            h(
                "button",
                {
                    type: "submit",
                    className: "upload-btn",
                    disabled: isUploading || !file
                },
                isUploading
                    ? h("span", { className: "btn-flex" }, h("i", { className: "fa-solid fa-spinner fa-spin" }), " Saving to MongoDB...")
                    : h("span", { className: "btn-flex" }, h("i", { className: "fa-solid fa-upload" }), " Upload & Save to DB")
            )
        ),
        uploadMsg && h(
            "div",
            { className: `upload-status-alert ${uploadMsg.includes("working") || uploadMsg.includes("success") || uploadMsg.includes("uploaded") ? "success" : "error"}` },
            h("i", { className: uploadMsg.includes("working") || uploadMsg.includes("success") || uploadMsg.includes("uploaded") ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation" }),
            h("span", null, uploadMsg)
        ),
        savedFiles.length > 0 && h(
            "div",
            { className: "stored-files-section" },
            h("h4", null, h("i", { className: "fa-solid fa-images" }), ` Stored Files in MongoDB (${savedFiles.length})`),
            h(
                "div",
                { className: "files-grid" },
                savedFiles.map((item, index) =>
                    h(
                        "div",
                        { key: item._id || index, className: "file-card" },
                        item.mimeType && item.mimeType.startsWith("image/")
                            ? h("div", { className: "file-card-preview" },
                                h("img", { src: item.url, alt: item.originalName || "Uploaded File" })
                            )
                            : h("div", { className: "file-card-icon" },
                                h("i", { className: "fa-solid fa-file-lines" })
                            ),
                        h(
                            "div",
                            { className: "file-card-details" },
                            h(
                                "div",
                                { className: "file-card-time-badge" },
                                h("i", { className: "fa-regular fa-clock" }),
                                " ",
                                formatUploadDateTime(item.uploadedAt)
                            ),
                            h("span", { className: "file-card-name", title: item.originalName || item.filename }, item.originalName || item.filename),
                            h("div", { className: "file-card-meta" },
                                h("span", null, `${(item.size / 1024).toFixed(1)} KB`),
                                h("a", { href: item.url, target: "_blank", className: "view-link" }, h("i", { className: "fa-solid fa-arrow-up-right-from-square" }), " Open")
                            )
                        )
                    )
                )
            )
        )
    );
}

function formatUploadDateTime(dateString) {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');

    return `${year}-${month}-${day} ${formattedHours}.${minutes} ${ampm}`;
}

function InfoTile({ icon, label, value }) {
    return h(
        "article",
        { className: "info-tile" },
        h("i", { className: icon }),
        h(
            "div",
            null,
            h("strong", null, label),
            h("span", null, value)
        )
    );
}

function App() {
    const [student, setStudent] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const savedStudent = JSON.parse(localStorage.getItem("student"));
        const savedToken = localStorage.getItem("token");

        if (savedStudent && savedToken) {
            setStudent(savedStudent);
            setToken(savedToken);
        }
    }, []);

    function handleLogin(studentData, token) {
        localStorage.setItem("student", JSON.stringify(studentData));
        localStorage.setItem("token", token);
        setStudent(studentData);
        setToken(token);
    }

    function handleLogout() {
        localStorage.removeItem("student");
        localStorage.removeItem("token");
        setStudent(null);
        setToken("");
    }

    return h(
        "main",
        { className: "container" },
        student
            ? h(StudentDashboard, {
                student,
                onLogout: handleLogout
            })
            : h(LoginForm, {
                onLogin: handleLogin
            })
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
