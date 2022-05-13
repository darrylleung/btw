import { Link } from "react-router-dom";
import { useForm } from ".//hooks/handle-form";
import { useHandleSubmit } from ".//hooks/handle-submit";

export function Login() {
    const [values, handleChange] = useForm();
    const [error, handleSubmit] = useHandleSubmit("/login", values);

    return (
        <section className="login">
            <span className="title">Log In</span>
            {error && <h2>Error logging in! 🚔</h2>}
            <form className="login">
                <label className="login" htmlFor="email">
                    <input
                        className="login"
                        name="email"
                        autoComplete="off"
                        placeholder="E-Mail"
                        type="email"
                        onChange={handleChange}
                    />
                    <span className="floating-label">E-Mail</span>
                </label>
                <label className="login" htmlFor="password">
                    <input
                        className="login"
                        autoComplete="off"
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={handleChange}
                    />
                    <span className="floating-label">Password</span>
                </label>
                <button className="submit" onClick={handleSubmit}>
                    Log In
                </button>
            </form>
            <span className="link2">
                <Link to="/registration">
                    Not a member? Click here to register.
                </Link>
                <Link to="/reset">Forgot your password?</Link>
            </span>
        </section>
    );
}
