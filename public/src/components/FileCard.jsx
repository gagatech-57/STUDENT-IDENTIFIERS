/**
 * Reusable FileCard Component for rendering user uploaded file items
 */

import { getFileUrl } from "../services/api.js";
import { formatUploadDateTime } from "../utils/formatters.js";

export function FileCard({ item }) {
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
