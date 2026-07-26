/**
 * Utility functions for date and file formatting
 */

export function formatUploadDateTime(dateString) {
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

export function formatFileSize(sizeInBytes) {
    if (!sizeInBytes || isNaN(sizeInBytes)) return "0 KB";
    const sizeInKb = sizeInBytes / 1024;
    if (sizeInKb >= 1024) {
        return `${(sizeInKb / 1024).toFixed(2)} MB`;
    }
    return `${sizeInKb.toFixed(1)} KB`;
}
