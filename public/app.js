const API = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://server-testing-skra.onrender.com";

function getFileUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API}${url.startsWith("/") ? "" : "/"}${url}`;
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

function AuthForm({ onLogin }) {
    const [isRegister, setIsRegister] = React.useState(false);
    
    // Login State
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    
    // Register State
    const [name, setName] = React.useState("");
    const [age, setAge] = React.useState("");
    const [department, setDepartment] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const [error, setError] = React.useState("");
    const [successMsg, setSuccessMsg] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    function toggleMode(mode) {
        setIsRegister(mode);
        setError("");
        setSuccessMsg("");
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccessMsg("");

        if (!email.trim() || !password.trim()) {
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

    return (
        <section className="auth-box">
            <div className="auth-tabs">
                <button
                    type="button"
                    className={`auth-tab-btn ${!isRegister ? "active" : ""}`}
                    onClick={() => toggleMode(false)}
                >
                    Login
                </button>
                <button
                    type="button"
                    className={`auth-tab-btn ${isRegister ? "active" : ""}`}
                    onClick={() => toggleMode(true)}
                >
                    Create Account
                </button>
            </div>

            <h1>{isRegister ? "Create Account" : "Student Login"}</h1>

            {!isRegister ? (
                <form onSubmit={handleLoginSubmit}>
                    <div className="input-box">
                        <i className="fa fa-envelope"></i>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <i className="fa fa-lock"></i>
                        <input
                            type="password"
                            value={password}
                            placeholder="Enter Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="auth-submit-btn">
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegisterSubmit}>
                    <div className="input-box">
                        <i className="fa-solid fa-user"></i>
                        <input
                            type="text"
                            value={name}
                            placeholder="Full Name"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <i className="fa-solid fa-graduation-cap"></i>
                        <input
                            type="text"
                            value={department}
                            placeholder="Department (e.g. Computer Science)"
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <i className="fa-solid fa-calendar"></i>
                        <input
                            type="number"
                            value={age}
                            placeholder="Age"
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <i className="fa-solid fa-envelope"></i>
                        <input
                            type="email"
                            value={email}
                            placeholder="Email Address"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <i className="fa-solid fa-lock"></i>
                        <input
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <i className="fa-solid fa-shield-halved"></i>
                        <input
                            type="password"
                            value={confirmPassword}
                            placeholder="Confirm Password (re-type password)"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="auth-submit-btn">
                        {isLoading ? "Creating Account..." : "Create Account & Login"}
                    </button>
                </form>
            )}

            {error && <p id="error">{error}</p>}
            {successMsg && <p className="success-text">{successMsg}</p>}
        </section>
    );
}

function StudentDashboard({ student, onLogout }) {
    return (
        <section className="profile-box">
            <header className="profile-header">
                <div>
                    <span className="profile-kicker">Student Portal</span>
                    <h1>Profile Dashboard</h1>
                </div>
                <div className="header-actions">
                    <span className="status-pill">Active</span>
                    <button
                        id="topLogoutBtn"
                        type="button"
                        onClick={onLogout}
                        title="Logout of session"
                    >
                        <i className="fa-solid fa-door-open"></i> Logout
                    </button>
                </div>
            </header>

            <div className="profile-panel">
                <div className="profile-hero">
                    <div className="student-avatar">
                        <i className="fa-solid fa-user-graduate"></i>
                    </div>
                    <div className="student-summary">
                        <span className="student-id">ID {student.studentId}</span>
                        <h2>{student.name}</h2>
                        <p>{student.email}</p>
                    </div>
                </div>

                <div className="detail-grid">
                    <InfoTile icon="fa-solid fa-id-card" label="Student ID" value={student.studentId} />
                    <InfoTile icon="fa-solid fa-building-columns" label="Department" value={student.department} />
                    <InfoTile icon="fa-solid fa-calendar" label="Age" value={student.age} />
                    <InfoTile icon="fa-solid fa-envelope" label="Email" value={student.email} />
                </div>

                <UploadTestCard student={student} />

                <div className="profile-footer">
                    <div className="barcode"></div>
                    <span className="profile-code">LOGGED IN: {student.email.toUpperCase()}</span>
                </div>
            </div>
        </section>
    );
}

function UploadTestCard({ student }) {
    const [file, setFile] = React.useState(null);
    const [uploadMsg, setUploadMsg] = React.useState("");
    const [isUploading, setIsUploading] = React.useState(false);
    const [savedFiles, setSavedFiles] = React.useState([]);
    const [isDragging, setIsDragging] = React.useState(false);

    React.useEffect(() => {
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
            console.error("Failed to fetch stored uploads:", e);
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

    return (
        <div className="upload-box">
            <div className="upload-header">
                <h3><i className="fa-solid fa-cloud-arrow-up"></i> File & Image Upload</h3>
            </div>

            <form onSubmit={handleUpload} className="upload-form">
                <div
                    className={`dropzone ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => document.getElementById("uploadInput").click()}
                >
                    <input
                        type="file"
                        id="uploadInput"
                        style={{ display: "none" }}
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <i className={file ? "fa-solid fa-file-circle-check drop-icon success" : "fa-solid fa-cloud-arrow-up drop-icon"}></i>
                    {file ? (
                        <div className="selected-file-info">
                            <strong>{file.name}</strong>
                            <span>{(file.size / 1024).toFixed(1)} KB • Click to change</span>
                        </div>
                    ) : (
                        <div className="drop-text">
                            <strong>Click or drag a file to upload</strong>
                            <span>Supports JPG, PNG, WEBP, GIF, PDF, DOCX (Max 10MB)</span>
                        </div>
                    )}
                </div>

                <button type="submit" className="upload-btn" disabled={isUploading || !file}>
                    {isUploading ? (
                        <span className="btn-flex"><i className="fa-solid fa-spinner fa-spin"></i> Uploading file...</span>
                    ) : (
                        <span className="btn-flex"><i className="fa-solid fa-upload"></i> Upload File</span>
                    )}
                </button>
            </form>

            {uploadMsg && (
                <div className={`upload-status-alert ${uploadMsg.includes("working") || uploadMsg.includes("success") || uploadMsg.includes("uploaded") ? "success" : "error"}`}>
                    <i className={uploadMsg.includes("working") || uploadMsg.includes("success") || uploadMsg.includes("uploaded") ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation"}></i>
                    <span>{uploadMsg}</span>
                </div>
            )}

            <div className="stored-files-section">
                <h4><i className="fa-solid fa-images"></i> My Uploaded Files ({savedFiles.length})</h4>
                {savedFiles.length > 0 ? (
                    <div className="files-grid">
                        {savedFiles.map((item, index) => (
                            <div key={item._id || index} className="file-card">
                                {item.mimeType && item.mimeType.startsWith("image/") ? (
                                    <div className="file-card-preview">
                                        <img src={getFileUrl(item.url)} alt={item.originalName || "Uploaded File"} />
                                    </div>
                                ) : (
                                    <div className="file-card-icon">
                                        <i className="fa-solid fa-file-lines"></i>
                                    </div>
                                )}
                                <div className="file-card-details">
                                    <div className="file-card-time-badge">
                                        <i className="fa-regular fa-clock"></i> {formatUploadDateTime(item.uploadedAt)}
                                    </div>
                                    <span className="file-card-name" title={item.originalName || item.filename}>
                                        {item.originalName || item.filename}
                                    </span>
                                    <div className="file-card-meta">
                                        <span>{(item.size / 1024).toFixed(1)} KB</span>
                                        <a href={getFileUrl(item.url)} target="_blank" className="view-link">
                                            <i className="fa-solid fa-arrow-up-right-from-square"></i> Open
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-files-box">
                        <i className="fa-regular fa-folder-open empty-icon"></i>
                        <p>No files uploaded by {student ? student.email : "you"} yet.</p>
                        <span>Upload an image above to see it appear here!</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoTile({ icon, label, value }) {
    return (
        <article className="info-tile">
            <i className={icon}></i>
            <div>
                <strong>{label}</strong>
                <span>{value}</span>
            </div>
        </article>
    );
}

function App() {
    const [student, setStudent] = React.useState(null);
    const [token, setToken] = React.useState("");

    React.useEffect(() => {
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

    return (
        <main className="container">
            {student ? (
                <StudentDashboard student={student} onLogout={handleLogout} />
            ) : (
                <AuthForm onLogin={handleLogin} />
            )}
        </main>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
