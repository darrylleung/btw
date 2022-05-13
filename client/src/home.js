import TypeIt from "typeit-react";

export function Home() {
    return (
        <div className="homeContainer">
            <TypeIt
                className="home"
                options={{
                    speed: 40,
                    deleteSpeed: 30,
                    waitUntilVisible: true,
                    cursor: true,
                    lifeLike: true,
                }}
                getBeforeInit={(instance) => {
                    instance
                        .type("What I wanted to say the other day ")
                        .pause(1500)
                        .delete()
                        .pause(1500)
                        .type("Do you remember that time we ")
                        .pause(1500)
                        .delete()
                        .pause(1500)
                        .type("Listen ")
                        .pause(1500)
                        .delete()
                        .pause(1500)
                        .type("This is kind of random but ")
                        .pause(1500)
                        .delete()
                        .pause(1500)
                        .type("It's been a while ")
                        .pause(1500)
                        .delete()
                        .pause(1500)
                        .type("By the way ");

                    return instance;
                }}
            />
        </div>
    );
}
