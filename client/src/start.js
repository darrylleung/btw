import ReactDOM from "react-dom";
import { Welcome } from "./welcome";
import { App } from "./app";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducer";
import { Provider } from "react-redux";
import { init } from "./sockets";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

//start.js
fetch("/user/id")
    .then((res) => res.json())
    .then((data) => {
        // console.log("data: ", data.userId);
        const { userId } = data;
        if (!userId) {
            // this means the user does not have the right cookie, and should see registration, login or password reset
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            //this means the user is logged in because their browser did have the right cookie
            console.log("user logged in");
            init(store);
            
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,
                document.querySelector("main")
            );
        }
    });
