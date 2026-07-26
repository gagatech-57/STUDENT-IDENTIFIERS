/**
 * Full React.js Single Page Application
 * Built with React 18, State-based Hash Routing, and Axios
 */

const { useState, useEffect, useRef, useCallback } = React;

// Centralized API Configuration
const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://server-testing-skra.onrender.com";

function getFileUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
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

/* API Service Functions using Axios */
async function loginUser(email, password) {
    try {
        const response = await window.axios.post(`${API_BASE_URL}/login`, {
            email: email.trim(),
            password: password.trim()
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || "Login failed");
    }
}

async function registerUser({ name, age, department, email, password }) {
    try {
        const response = await window.axios.post(`${API_BASE_URL}/register`, {
            name: name.trim(),
            age: Number(age),
            department: department.trim(),
            email: email.trim(),
            password: password.trim()
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || "Registration failed");
    }
}

async function fetchUserUploads(userEmail) {
    try {
        const response = await window.axios.get(`${API_BASE_URL}/upload/files`, {
            params: { uploadedBy: userEmail }
        });
        return response.data.files || [];
    } catch (err) {
        console.error("Failed to fetch uploads:", err);
        return [];
    }
}

async function uploadSingleFile(file, uploadedByEmail) {
    const formData = new FormData();
    formData.append("photo", file);
    if (uploadedByEmail) {
        formData.append("uploadedBy", uploadedByEmail);
    }

    try {
        const response = await window.axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || "Upload failed");
    }
}

/* Custom Hooks */
function useAuth() {
    const [student, setStudent] = useState(() => {
        try {
            const saved = localStorage.getItem("student");
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setError("");
        try {
            const data = await loginUser(email, password);
            localStorage.setItem("student", JSON.stringify(data.student));
            localStorage.setItem("token", data.token);
            setStudent(data.student);
            setToken(data.token);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (userData) => {
        setIsLoading(true);
        setError("");
        try {
            const data = await registerUser(userData);
            localStorage.setItem("student", JSON.stringify(data.student));
            localStorage.setItem("token", data.token);
            setStudent(data.student);
            setToken(data.token);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("student");
        localStorage.removeItem("token");
        setStudent(null);
        setToken("");
        setError("");
    }, []);

    return {
        student,
        token,
        isAuthenticated: !!student,
        isLoading,
        error,
        setError,
        login,
        register,
        logout
    };
}

function useUploads(userEmail) {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);
    const [uploadMsg, setUploadMsg] = useState("");
    const [uploadError, setUploadError] = useState("");

    const loadFiles = useCallback(async () => {
        if (!userEmail) return;
        setIsLoadingFiles(true);
        try {
            const userFiles = await fetchUserUploads(userEmail);
            setFiles(userFiles);
        } catch (err) {
            console.error("Failed to load user uploads:", err);
        } finally {
            setIsLoadingFiles(false);
        }
    }, [userEmail]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    const upload = useCallback(async (selectedFile) => {
        if (!selectedFile) {
            setUploadError("Please select a file to upload");
            return;
        }

        setIsUploading(true);
        setUploadMsg("");
        setUploadError("");

        try {
            const data = await uploadSingleFile(selectedFile, userEmail);
            setUploadMsg(data.message || "Upload successful!");
            await loadFiles();
            return data;
        } catch (err) {
            setUploadError(err.message || "File upload failed");
            throw err;
        } finally {
            setIsUploading(false);
        }
    }, [userEmail, loadFiles]);

    return {
        files,
        isUploading,
        isLoadingFiles,
        uploadMsg,
        uploadError,
        setUploadMsg,
        setUploadError,
        upload,
        reloadFiles: loadFiles
    };
}

/* UI Components */
function Navbar({ student, onLogout }) {
    return (
        <header className="profile-header">
            <div>
                <span className="profile-kicker">Student Portal</span>
                <h1>Profile Dashboard</h1>
            </div>
            {student && (
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
            )}
        </header>
    );
}

function Footer({ studentEmail }) {
    return (
        <div className="profile-footer">
            <div className="barcode"></div>
            {studentEmail && (
                <span className="profile-code">LOGGED IN: {studentEmail.toUpperCase()}</span>
            )}
        </div>
    );
}

function Button({ children, type = "button", disabled = false, isLoading = false, className = "", onClick, ...props }) {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={`btn-custom ${className}`}
            onClick={onClick}
            {...props}
        >
            {isLoading ? (
                <span className="btn-flex">
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading...
                </span>
            ) : (
                children
            )}
        </button>
    );
}

function Input({ type = "text", value, placeholder, icon, onChange, required = true }) {
    return (
        <div className="input-box">
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
            />
            {icon && <i className={icon}></i>}
        </div>
    );
}

function InfoTile({ icon, label, value }) {
    return (
        <div className="info-tile">
            <i className={icon}></i>
            <strong>{label}</strong>
            <span>{value || "N/A"}</span>
        </div>
    );
}

function FileCard({ item }) {
    const isImage = item.mimeType && item.mimeType.startsWith("image/");

    return (
        <div className="file-card">
            {isImage ? (
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
                    <a href={getFileUrl(item.url)} target="_blank" rel="noopener noreferrer" className="view-link">
                        <i className="fa-solid fa-arrow-up-right-from-square"></i> Open
                    </a>
                </div>
            </div>
        </div>
    );
}

function Dropzone({ file, setFile, onUploadSubmit, isUploading }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    }

    return (
        <form onSubmit={onUploadSubmit} className="upload-form">
            <div
                className={`dropzone ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
                <input
                    type="file"
                    id="uploadInput"
                    ref={fileInputRef}
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
    );
}


/* Page Views */
function LoginPage({ onLogin, onRegister, isLoading, authError }) {
    const [isRegister, setIsRegister] = useState(false);
    
    // Login State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Register State
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [department, setDepartment] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [formError, setFormError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    function toggleMode(mode) {
        setIsRegister(mode);
        setFormError("");
        setSuccessMsg("");
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();
        setFormError("");
        setSuccessMsg("");

        if (!email.trim() || !password.trim()) {
            setFormError("Please enter Email & Password");
            return;
        }

        try {
            await onLogin(email, password);
        } catch (err) {
            // error handled by hook
        }
    }

    async function handleRegisterSubmit(event) {
        event.preventDefault();
        setFormError("");
        setSuccessMsg("");

        if (!name.trim() || !age.trim() || !department.trim() || !email.trim() || !password || !confirmPassword) {
            setFormError("Please fill all required fields");
            return;
        }

        if (password !== confirmPassword) {
            setFormError("Passwords do not match! Please check both password fields.");
            return;
        }

        try {
            await onRegister({ name, age, department, email, password });
            setSuccessMsg("Account Created Successfully! Logging you in...");
        } catch (err) {
            // error handled by hook
        }
    }

    const displayedError = formError || authError;

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
                    <Input
                        type="email"
                        value={email}
                        placeholder="Enter Email"
                        icon="fa fa-envelope"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        value={password}
                        placeholder="Enter Password"
                        icon="fa fa-lock"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" isLoading={isLoading} className="auth-submit-btn">
                        Login
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleRegisterSubmit}>
                    <Input
                        type="text"
                        value={name}
                        placeholder="Full Name"
                        icon="fa-solid fa-user"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        type="text"
                        value={department}
                        placeholder="Department (e.g. Computer Science)"
                        icon="fa-solid fa-graduation-cap"
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                    <Input
                        type="number"
                        value={age}
                        placeholder="Age"
                        icon="fa-solid fa-calendar"
                        onChange={(e) => setAge(e.target.value)}
                    />
                    <Input
                        type="email"
                        value={email}
                        placeholder="Email Address"
                        icon="fa-solid fa-envelope"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        value={password}
                        placeholder="Password"
                        icon="fa-solid fa-lock"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        type="password"
                        value={confirmPassword}
                        placeholder="Confirm Password (re-type password)"
                        icon="fa-solid fa-shield-halved"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button type="submit" isLoading={isLoading} className="auth-submit-btn">
                        Create Account & Login
                    </Button>
                </form>
            )}

            {displayedError && <p id="error">{displayedError}</p>}
            {successMsg && <p className="success-text">{successMsg}</p>}
        </section>
    );
}

function DashboardPage({ student, onLogout, uploadsState }) {
    const [fileToUpload, setFileToUpload] = useState(null);

    const {
        files,
        isUploading,
        uploadMsg,
        uploadError,
        upload
    } = uploadsState;

    async function handleUploadSubmit(event) {
        event.preventDefault();
        try {
            await upload(fileToUpload);
            setFileToUpload(null);
            const fileInput = document.getElementById("uploadInput");
            if (fileInput) fileInput.value = "";
        } catch (e) {
            // error handled in hook state
        }
    }

    const alertMsg = uploadMsg || uploadError;
    const isSuccess = !!uploadMsg;

    return (
        <section className="profile-box">
            <Navbar student={student} onLogout={onLogout} />

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

                <div className="upload-box">
                    <div className="upload-header">
                        <h3><i className="fa-solid fa-cloud-arrow-up"></i> File & Image Upload</h3>
                    </div>

                    <Dropzone
                        file={fileToUpload}
                        setFile={setFileToUpload}
                        onUploadSubmit={handleUploadSubmit}
                        isUploading={isUploading}
                    />

                    {alertMsg && (
                        <div className={`upload-status-alert ${isSuccess ? "success" : "error"}`}>
                            <i className={isSuccess ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation"}></i>
                            <span>{alertMsg}</span>
                        </div>
                    )}

                    <div className="stored-files-section">
                        <h4><i className="fa-solid fa-images"></i> My Uploaded Files ({files.length})</h4>
                        {files.length > 0 ? (
                            <div className="files-grid">
                                {files.map((item, index) => (
                                    <FileCard key={item._id || index} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-files-box">
                                <i className="fa-regular fa-folder-open empty-icon"></i>
                                <p>No files uploaded by {student.email} yet.</p>
                                <span>Upload an image above to see it appear here!</span>
                            </div>
                        )}
                    </div>
                </div>

                <Footer studentEmail={student.email} />
            </div>
        </section>
    );
}

/* Root App Component */
function App() {
    const {
        student,
        isAuthenticated,
        isLoading: authLoading,
        error: authError,
        login,
        register,
        logout
    } = useAuth();

    const [currentHash, setCurrentHash] = useState(() => window.location.hash || "#/login");

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash || "#/login");
        };
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const uploadsState = useUploads(student ? student.email : null);

    useEffect(() => {
        if (isAuthenticated) {
            if (currentHash !== "#/dashboard") {
                window.location.hash = "#/dashboard";
            }
        } else {
            if (currentHash === "#/dashboard") {
                window.location.hash = "#/login";
            }
        }
    }, [isAuthenticated, currentHash]);

    return (
        <main className="container">
            {isAuthenticated ? (
                <DashboardPage
                    student={student}
                    onLogout={() => {
                        logout();
                        window.location.hash = "#/login";
                    }}
                    uploadsState={uploadsState}
                />
            ) : (
                <LoginPage
                    onLogin={async (email, pwd) => {
                        await login(email, pwd);
                        window.location.hash = "#/dashboard";
                    }}
                    onRegister={async (data) => {
                        await register(data);
                        window.location.hash = "#/dashboard";
                    }}
                    isLoading={authLoading}
                    authError={authError}
                />
            )}
        </main>
    );
}

// Render React App
const rootElement = document.getElementById("root");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}
