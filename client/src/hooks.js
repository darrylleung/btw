import { useEffect, useState } from "react";

export function Hooks() {
    // const [name, setName] = useState("Truffle");
    // const [emoji, setEmoji] = useState("🐒");

    // return (
    //     <section>
    //         <h1>Hey {name} {emoji}</h1>
    //         <input onChange={(e) => setName(e.target.value)} />
    //     </section>
    // );

    const [search, setSearch] = useState("");

    useEffect(() => {
        console.log("In Use Effect");
        fetch(`/countries?search=${search}`)
            .then((res) => res.json())
            .then((countries) => console.log(countries));
    }, [search]);

    console.log(search);

    return (
        <input name={"search"} onChange={(e) => setSearch(e.target.value)} />
    );
}
