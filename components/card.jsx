import React from "react";
import _ from "lodash";

class BingoGrid extends React.Component {
    /**
     * Not the most efficient algorithm but it gets the job done
     */
    randomSubset(arr, size) {
        var shuffled = _.shuffle(arr.slice(0));
        return shuffled.slice(0, size);
    }

    render() {
        var phrasesSubset = this.randomSubset(this.props.phrases, 24);
        var rows = [];
        // instead of dealing with index complications just insert the Free tile in the middle
        phrasesSubset.splice(12, 0, { "phrase": "Free" });
        for(let i = 0; i < 5; i++) {
            let cells = [];
            for(let j = 0; j < 5; j++) {
                let contents = phrasesSubset[i * 5 + j].phrase;
				cells.push(<td key={i * 5 + j} className="bingo-tile">
					<span>{ contents }</span>
				</td>);
            }
            rows.push(<tr key={i}>{ cells }</tr>);
        }
        return <table id="bingo-tile-container"><tbody>{ rows }</tbody></table>;
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
        return (<div id="grid-wrapper">
			<button className="btn btn-primary" type="button"
				onClick={this.onClick}>Generate New Grid</button>
            { grid }
        </div>);
    }
}
