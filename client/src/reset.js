import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from ".//hooks/handle-form";
import OtpInput from "react-otp-input-rc-17";

export function ResetPassword() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState(false);
    const [otp, setOtp] = useState();
    const [values, handleChange] = useForm();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(
            "User wants to send data to the server and reset password."
        );
        console.log("Data the user submitted: ", values);
        fetch("/reset/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then(({ success }) => {
                if (!success) {
                    setError("There has been an error.");
                } else {
                    setStep(2);
                    setError(false);
                }
            })
            .catch((err) => {
                console.log("err on fetch password/reset/start: ", err);
            });
    };

    const handleOtpChange = (otp) => {
        console.log("User is typing in the input field");
        console.log("What is otp ", otp);
        setOtp(otp);
    };

    const handleVerify = (e) => {
        e.preventDefault();
        values.otp = otp;
        console.log("values object: ", values);

        fetch("/reset/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then(({ verified }) => {
                if (!verified) {
                    setError("Could not verify.");
                } else {
                    setStep(3);
                    setError(false);
                }
            })
            .catch((err) => {
                console.log("err on fetch password/reset/verify: ", err);
            });
    };

    if (step === 1) {
        return (
            <section className="reset">
                <span className="title">Reset Password</span>
                {error && <span className="error">{error}</span>}
                <form className="reset">
                    <label className="reset">
                        <input
                            className="reset"
                            autoComplete="off"
                            name="email"
                            placeholder="E-Mail"
                            type="email"
                            key="start"
                            onChange={handleChange}
                        />
                        <span className="floating-label">E-Mail</span>
                    </label>
                    <button className="submit" onClick={handleSubmit}>
                        Submit
                    </button>
                </form>
            </section>
        );
    } else if (step === 2) {
        return (
            <section className="verify">
                <span className="title">Verify Code</span>
                {error && <span className="error">{error}</span>}
                <form className="reset">
                    <OtpInput
                        value={otp}
                        onChange={handleOtpChange}
                        numInputs={6}
                        inputStyle="otp"
                        separator={<span> </span>}
                    />

                    <label className="verify">
                        <input
                            className="verify"
                            autoComplete="off"
                            name="password"
                            placeholder="New Password"
                            type="password"
                            onChange={handleChange}
                        />
                        <span className="floating-label">New Password</span>
                    </label>
                    <button className="submit" onClick={handleVerify}>
                        Submit
                    </button>
                </form>
            </section>
        );
    } else {
        return (
            <section className="success">
                <span className="title">Success! ✨</span>
                <span className="success">
                    Please <Link to="/login">login</Link> again.
                </span>
            </section>
        );
    }
}
