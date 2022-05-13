import { useState } from "react";

export function useForm() {
    const [values, setValues] = useState();

    const handleChange = ({ target }) => {
        console.log("User is typing in the input field");
        console.log("Which input field is the user typing in: ", target.name);
        console.log("What is the user typing: ", target.value);
        console.log("Number of characters typed: ", target.value.length);
        setValues({
            ...values,
            [target.name]: target.value.trim(),
        });
    };

    return [values, handleChange];
}
