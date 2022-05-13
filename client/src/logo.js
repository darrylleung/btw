import { Component } from "react";

export class Logo extends Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("Logo has mounted.");
    }

    render() {
        return <img className="underconstruction" src="/images/UNDERCONSTRUCTION.png" alt="logo" />;
    }
}
