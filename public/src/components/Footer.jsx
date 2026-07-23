/**
 * Reusable Footer Component displaying Barcode and Logged-In User session info
 */

export function Footer({ studentEmail }) {
    return (
        <div className="profile-footer">
            <div className="barcode"></div>
            {studentEmail && (
                <span className="profile-code">LOGGED IN: {studentEmail.toUpperCase()}</span>
            )}
        </div>
    );
}
