import App from "./app";
import { render, waitFor } from "@testing-library/react";

test("app eventually renders a div", async () => {
    //first we mock the values we normally retrive in componentDidMount
    fetch.mockResolvedValue({
        async json() {
            return {
                id: 2,
                first: "Merle",
                last: "Fischer",
                url: "www.someimage.com",
            };
        },
    });
    //second: we create an instance of our Component that we are testing by passing to render from react testing library
    const { container } = render(<App />);
    expect(container.innerHtml).toContain("...loading");

    //we're expecting that eventually when our mock fetch is done that we would have a changed UI
    await waitFor(() => {
        console.log("inside waitFor: ", container.querySelector(".app-container").innerHtml);
        expect(container.querySelector(".app-container")).toBeTruthy();
    });
});
