/**
 * NotFoundPage 404 Component
 */

export function NotFoundPage() {
    return (
        <section className="auth-box" style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>404</h1>
            <p style={{ color: "#a1a1aa", marginBottom: "20px" }}>Page Not Found</p>
            <a href="#/" style={{ color: "#ffffff", fontWeight: "bold" }}>Back to Home</a>
        </section>
    );
}
