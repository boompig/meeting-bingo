import React from "react";
import ReactDOM from "react-dom";
import BingoCard from "./card.jsx";
import Phrases from "./phrases.jsx";

export default class MeetingBingo extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (<div>
            <Phrases />
        </div>);
    }
}

ReactDOM.render(
    <MeetingBingo />,
    document.getElementById("main-container")
);
