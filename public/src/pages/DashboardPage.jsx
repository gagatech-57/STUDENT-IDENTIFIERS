/**
 * DashboardPage Component displaying profile details, user uploads, and Axios API Tester
 */

import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { InfoTile } from "../components/InfoTile.jsx";
import { Dropzone } from "../components/Dropzone.jsx";
import { FileCard } from "../components/FileCard.jsx";
import { AxiosApiTester } from "../components/AxiosApiTester.jsx";

export function DashboardPage({ student, onLogout, uploadsState }) {
    const [fileToUpload, setFileToUpload] = React.useState(null);

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

                {/* Axios Backend API Tester Section */}
                <AxiosApiTester />

                <Footer studentEmail={student.email} />
            </div>
        </section>
    );
}
