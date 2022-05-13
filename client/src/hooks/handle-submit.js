import { useState } from "react";

export function useHandleSubmit(url, values) {
    const [error, setError] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Server response from POST /login.json: ", data);
                data.success ? location.replace("/") : setError(true);
            })
            .catch((err) => {
                console.log("err on fetch login.json: ", err);
            });
    };
    return [error, handleSubmit];
}
