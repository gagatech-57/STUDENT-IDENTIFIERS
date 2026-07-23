const API = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://server-testing-skra.onrender.com";

function getFileUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API}${url.startsWith("/") ? "" : "/"}${url}`;
}

const { createElement: h, useEffect, useState } = React;

function AuthForm({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    
    // Login Fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Register Fields
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [department, setDepartment] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function toggleMode(mode) {
        setIsRegister(mode);
        setError("");
        setSuccessMsg("");
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccessMsg("");

        if (email.trim() === "" || password.trim() === "") {
            setError("Please enter Email & Password");
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password: password.trim() })
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            onLogin(data.student, data.token);
        } catch (err) {
            setError("Server Connection Failed");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRegisterSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccessMsg("");

        if (!name.trim() || !age.trim() || !department.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please fill all required fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match! Please check both password fields.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${API}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    age: Number(age),
                    department: department.trim(),
                    email: email.trim(),
                    password: password.trim()
                })
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Registration failed");
                return;
            }

            setSuccessMsg("Account Created Successfully! Logging you in...");
            setTimeout(() => {
                onLogin(data.student, data.token);
            }, 1000);
        } catch (err) {
            setError("Server Connection Error during Registration");
        } finally {
            setIsLoading(false);
        }
    }

    return h(
        "section",
        { className: "auth-box" },
        h(
            "div",
            { className: "auth-tabs" },
            h(
                "button",
                {
                    type: "button",
                    className: `auth-tab-btn ${!isRegister ? "active" : ""}`,
                    onClick: () => toggleMode(false)
                },
                "Login"
            ),
            h(
                "button",
                {
                    type: "button",
                    className: `auth-tab-btn ${isRegister ? "active" : ""}`,
                    onClick: () => toggleMode(true)
                },
                "Create Account"
            )
        ),
        h("h1", null, isRegister ? "Create Account" : "Student Login"),
        !isRegister
            ? h(
                "form",
                { onSubmit: handleLoginSubmit },
                h(
                    "div",
                    { className: "input-box" },
                    h("i", { className: "fa fa-envelope" }),
                    h("input", {
                        type: "email",
                        value: email,
                        placeholder: "Enter Email",
                        onChange: (e) => setEmail(e.target.value)
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
                        onChange: (e) => setPassword(e.target.value)
                    })
                ),
                h(
                    "button",
                    { type: "submit", disabled: isLoading, className: "auth-submit-btn" },
                    isLoading ? "Logging in..." : "Login"
                )
            )
            : h(
                "form",
                { onSubmit: handleRegisterSubmit },
                h(
                    "div",
                    { className: "input-box" },
                    h("i", { className: "fa-solid fa-user" }),
                    h("input", {
                        type: "text",
                        value: name,
                        placeholder: "Full Name",
                        onChange: (e) => setName(e.target.value)
                    })
                ),
                h(
                    "div",
                    { className: "input-box" },
                    h("i", { className: "fa-solid fa-graduation-cap" }),
                    h("input", {
                        type: "text",
                        value: department,
                        placeholder: "Department (e.g. Computer Science)",
                        onChange: (e) => setDepartment(e.target.value)
                    })
                ),
                h(
                    "div",
                    { className: "input-box" },
                    h("i", { className: "fa-solid fa-calendar" }),
                    h("input", {
                        type: "number",
                        value: age,
                        placeholder: "Age",
                        onChange: (e) => setAge(e.target.value)
                    })
                ),
                h(
                    "div",
                    { className: "input-box" },
                    h("i", { className: "fa-solid fa-envelope" }),
                    h("input", {
                        type: "email",
                        value: email,
                        placeholder: "Email Address",
                        onChange: (e) => setEmail(e.target.value)
                    })
                ),
                h(
                    "div",
                    { className: "input-box" },
                    h("i", { className: "fa-solid fa-lock" }),
                    h("input", {
                        type: "password",
                        value: password,
                        placeholder: "Password",
                        onChange: (e) => setPassword(e.target.value)
                    })
                ),
                h(
                    "div",
                    { className: "input-box" },
                    h("i", { className: "fa-solid fa-shield-halved" }),
                    h("input", {
                        type: "password",
                        value: confirmPassword,
                        placeholder: "Confirm Password (re-type password)",
                        onChange: (e) => setConfirmPassword(e.target.value)
                    })
                ),
                h(
                    "button",
                    { type: "submit", disabled: isLoading, className: "auth-submit-btn" },
                    isLoading ? "Creating Account..." : "Create Account & Login"
                )
            ),
        error && h("p", { id: "error" }, error),
        successMsg && h("p", { className: "success-text" }, successMsg)
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
            h(
                "div",
                { className: "header-actions" },
                h("span", { className: "status-pill" }, "Active"),
                h(
                    "button",
                    {
                        id: "topLogoutBtn",
                        type: "button",
                        onClick: onLogout,
                        title: "Logout of session"
                    },
                    h("i", { className: "fa-solid fa-door-open" }),
                    " Logout"
                )
            )
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
            h(UploadTestCard, { student }),
            h(
                "div",
                { className: "profile-footer" },
                h("div", { className: "barcode" }),
                h("span", { className: "profile-code" }, `LOGGED IN: ${student.email.toUpperCase()}`)
            )
        )
    );
}

function UploadTestCard({ student }) {
    const [file, setFile] = useState(null);
    const [uploadMsg, setUploadMsg] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [savedFiles, setSavedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (student && student.email) {
            fetchUserFiles(student.email);
        }
    }, [student]);

    async function fetchUserFiles(userEmail) {
        try {
            const res = await fetch(`${API}/upload/files?uploadedBy=${encodeURIComponent(userEmail)}`);
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
        if (student && student.email) {
            formData.append("uploadedBy", student.email);
        }

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
                fetchUserFiles(student.email);
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
            h("h3", null, h("i", { className: "fa-solid fa-cloud-arrow-up" }), " File & Image Upload")
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
                    ? h("span", { className: "btn-flex" }, h("i", { className: "fa-solid fa-spinner fa-spin" }), " Uploading file...")
                    : h("span", { className: "btn-flex" }, h("i", { className: "fa-solid fa-upload" }), " Upload File")
            )
        ),
        uploadMsg && h(
            "div",
            { className: `upload-status-alert ${uploadMsg.includes("working") || uploadMsg.includes("success") || uploadMsg.includes("uploaded") ? "success" : "error"}` },
            h("i", { className: uploadMsg.includes("working") || uploadMsg.includes("success") || uploadMsg.includes("uploaded") ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation" }),
            h("span", null, uploadMsg)
        ),
        h(
            "div",
            { className: "stored-files-section" },
            h("h4", null, h("i", { className: "fa-solid fa-images" }), ` My Uploaded Files (${savedFiles.length})`),
            savedFiles.length > 0
                ? h(
                    "div",
                    { className: "files-grid" },
                    savedFiles.map((item, index) =>
                        h(
                            "div",
                            { key: item._id || index, className: "file-card" },
                            item.mimeType && item.mimeType.startsWith("image/")
                                ? h("div", { className: "file-card-preview" },
                                    h("img", { src: getFileUrl(item.url), alt: item.originalName || "Uploaded File" })
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
                                    h("a", { href: getFileUrl(item.url), target: "_blank", className: "view-link" }, h("i", { className: "fa-solid fa-arrow-up-right-from-square" }), " Open")
                                )
                            )
                        )
                    )
                )
                : h(
                    "div",
                    { className: "empty-files-box" },
                    h("i", { className: "fa-regular fa-folder-open empty-icon" }),
                    h("p", null, `No files uploaded by ${student ? student.email : "you"} yet.`),
                    h("span", null, "Upload an image above to see it appear here!")
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
            : h(AuthForm, {
                onLogin: handleLogin
            })
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
