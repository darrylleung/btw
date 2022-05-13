import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function FindUsers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState();

    useEffect(() => {
        let abort = false;

        fetch(`/users?search=${searchTerm}`)
            .then((res) => res.json())
            .then((users) => {
                if (!abort) {
                    setUsers(users);
                    console.log("Search Results: ", users);
                }
            });
        return () => (abort = true);
    }, [searchTerm]);

    return (
        <div className="findUsers">
            <input
                className="findUsers"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Begin your search..."
            />
            {/* <div>Searching for: {searchTerm}</div> */}

            <div className="searchResultContainer">
                {users?.map((users) => {
                    //optional chaining. add a ? to initialize on truthy value
                    // console.log("users: ", users);
                    return (
                        <div className="searchResult" key={users.id}>
                            <Link to={`/user/${users.id}`}>
                                <img
                                    className="profilePic"
                                    src={
                                        users.imageurl || "/images/default.png"
                                    }
                                />
                                <div className="searchResultNames">
                                    {users.firstname} {users.lastname}
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
