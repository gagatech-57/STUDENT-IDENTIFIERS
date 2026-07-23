/**
 * Reusable Navbar Component with Top-Right Logout button and Door Open Icon
 */

export function Navbar({ student, onLogout }) {
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
