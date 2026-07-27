/**
 * Reusable Loader Component for loading states
 */

export function Loader({ label = "Loading..." }) {
    return (
        <div className="loader-container">
            <i className="fa-solid fa-circle-notch fa-spin loader-spinner"></i>
            <span>{label}</span>
        </div>
    );
}
