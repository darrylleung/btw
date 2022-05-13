// below we are importing something not exported as default
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Home } from "./home";
import { Registration } from "./registration";
import { Login } from "./login";
import { ResetPassword } from "./reset";

export function Welcome() {
    return (
        <>
            <BrowserRouter>
                <div className="header">
                    <div className="header-left">
                        <Link to="/">
                            <span className="logo">btw</span>
                        </Link>
                    </div>
                    <div className="header-right">
                        <div className="nav">
                            <Link to="/registration" className="login">
                                <button className="register">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                        <div className="nav">
                            <Link to="/login" className="login">
                                <button className="login">
                                    Log In
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/registration">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/reset">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </>
    );
}
