import React from "react";
import _ from "lodash";

class BingoGrid extends React.Component {
    /**
     * Not the most efficient algorithm but it gets the job done
     */
    randomSubset(arr, size) {
        var shuffled = _.shuffle(arr.slice(0));
        return arr.slice(0, size);
    }

    render() {
        var phrasesSubset = this.randomSubset(this.props.phrases, 24);
        var tiles = [];
        for(let i = 0; i < 25; i++) {
            if(i === 12) {
                tiles.push(<div key={i} className="bingo-tile">Free</div>);
            } else if(i < 12) {
                tiles.push(<div key={i} className="bingo-tile">{ phrasesSubset[i] }</div>);
            } else {
                tiles.push(<div key={i} className="bingo-tile">{ phrasesSubset[i - 1] }</div>);
            }
        }
        return <div id="bingo-tile-container">{ tiles }</div>;
    }
}

export default class BingoCard extends React.Component {
    constructor() {
        super();
        this.state = {
            "showGrid": false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        event.preventDefault();
        this.setState({"showGrid": true });
    }

    render() {
        var grid = null;
        if(this.state.showGrid) {
            console.log("showGrid:");
            console.log(this.props.phrases);
            grid = <BingoGrid phrases={this.props.phrases} />;
        }
        return (<div>
            <button type="button" onClick={this.onClick}>Generate New Grid</button>
            { grid }
        </div>);
    }
}
