import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from ".//hooks/handle-form";

export function Registration() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState(false);
    const [values, handleChange] = useForm();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User wants to send data to the server and set password.");
        console.log("Data the user submitted: ", values);

        if (
            values == undefined ||
            values === " " ||
            values.first == undefined ||
            values.first === " " ||
            values.last == undefined ||
            values.last === " " ||
            values.email == undefined ||
            values.email === " "
        ) {
            return setError(true);
        }

        if (values.password == undefined) {
            fetch("/register/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.success) {
                        setError(true);
                    } else {
                        setStep(2);
                        setError(false);
                    }
                })
                .catch((err) => {
                    console.log("err on fetch /register ", err);
                    setError(true);
                });
        } else {
            fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(
                        "Server response from POST /register/password: ",
                        data
                    );
                    data.success ? location.replace("/") : setError(true);
                })
                .catch((err) => {
                    console.log("err on fetch /register ", err);
                    setError(true);
                });
        }
    };

    if (step === 1) {
        return (
            <section className="registration">
                <span className="title">Register</span>
                {error && <span className="error">Error registering 🙅🏻‍♀️</span>}
                <form className="registration">
                    <label className="registration" htmlFor="first">
                        <input
                            className="registration"
                            autoComplete="off"
                            name="first"
                            placeholder="First Name"
                            type="text"
                            onChange={handleChange}
                        />
                        <span className="floating-label">First Name</span>
                    </label>
                    <label className="registration" htmlFor="last">
                        <input
                            className="registration"
                            autoComplete="off"
                            name="last"
                            placeholder="Last Name"
                            type="text"
                            onChange={handleChange}
                        />
                        <span className="floating-label">Last Name</span>
                    </label>
                    <label className="registration" htmlFor="email">
                        <input
                            className="registration"
                            autoComplete="off"
                            name="email"
                            placeholder="E-Mail"
                            type="email"
                            onChange={handleChange}
                            required
                        />
                        <span className="floating-label">E-Mail</span>
                    </label>
                    <button className="submit" onClick={handleSubmit}>
                        Submit
                    </button>
                </form>
                <span className="link">
                    <Link to="/login">Already registered? Log in.</Link>
                </span>
            </section>
        );
    } else {
        return (
            <section className="registration">
                <span className="title">Register</span>
                {error && (
                    <span className="error">Passwords did not match 🙅🏼‍♂️</span>
                )}
                <form className="registration">
                    <label className="registration" htmlFor="password">
                        <input
                            className="registration"
                            autoComplete="off"
                            name="password"
                            placeholder="Password"
                            type="password"
                            key="password"
                            onChange={handleChange}
                        />
                        <span className="floating-label">Password</span>
                    </label>
                    <label className="registration" htmlFor="password2">
                        <input
                            className="registration"
                            autoComplete="off"
                            name="password2"
                            placeholder="Confirm Password"
                            type="password"
                            key="password2"
                            onChange={handleChange}
                        />
                        <span className="floating-label">Confirm Password</span>
                    </label>
                    <button className="submit" onClick={handleSubmit}>
                        Submit
                    </button>
                </form>
            </section>
        );
    }
}
