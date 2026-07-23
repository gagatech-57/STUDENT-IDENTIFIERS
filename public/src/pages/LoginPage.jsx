/**
 * LoginPage Component with Login & Register Tab Toggle
 */

import { Input } from "../components/Input.jsx";
import { Button } from "../components/Button.jsx";

export function LoginPage({ onLogin, onRegister, isLoading, authError }) {
    const [isRegister, setIsRegister] = React.useState(false);
    
    // Login State
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    
    // Register State
    const [name, setName] = React.useState("");
    const [age, setAge] = React.useState("");
    const [department, setDepartment] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const [formError, setFormError] = React.useState("");
    const [successMsg, setSuccessMsg] = React.useState("");

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
