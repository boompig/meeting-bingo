import React from "react";
import shuffle from "lodash.shuffle";
import PropType from "prop-types";

const COLS = ["B", "I", "N", "G", "O"];

/**
 * This component should not receive all phrases, only 24 of them
 */
export class BingoGrid extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		const rows = [];

		for(let row = 0; row < 5; row++) {
			let cells = [];
			for(let col = 0; col < 5; col++) {
				let idx = col * 5 + row;
				let key = COLS[col] + (row + 1);
				let contents;
				if(idx === 12) {
					contents = "Free";
				} else if(idx > 12) {
					contents = this.props.phrases[idx - 1].phrase;
				} else {
					contents = this.props.phrases[idx].phrase;
				}

				let classes = "bingo-tile";
				if(this.props.bingoCells.indexOf(key) !== -1) {
					classes += " bingo-cell";
				} else if(key in this.props.clickedCells) {
					classes += " cell-clicked";
				}

				cells.push(<td key={key} data-key={key} className={classes}
					onClick={() => this.props.handleCellClicked(key)}>
					<span>{ contents }</span>
				</td>);
			}
			rows.push(<tr key={row}>{ cells }</tr>);
		}
		return (<table id="bingo-tile-container">
			<thead>
				<tr>
					<th>B</th>
					<th>I</th>
					<th>N</th>
					<th>G</th>
					<th>O</th>
				</tr>
			</thead>
			<tbody>{ rows }</tbody>
		</table>);
	}
}

BingoGrid.propTypes = {
	phrases: PropType.array.isRequired,
	clickedCells: PropType.object.isRequired,
	bingoCells: PropType.array,

	handleCellClicked: PropType.func.isRequired
};

/**
 * Not the most efficient algorithm but it gets the job done
 * @param {string[]} arr
 * @param {number} size
 * @returns {string[]}
 */
function randomSubset(arr, size) {
	let shuffled = shuffle(arr.slice(0));
	return shuffled.slice(0, size);
}

/**
 * @param {array} phrases
 * @param {number} genSeed
 * @returns {string}
 */
function computeArrayHash(phrases, genSeed) {
	let l = phrases.map((p) => p.phrase);
	return l.join(",") + genSeed;
}

/**
 * @param {string} row 1-indexed row as string
 * @returns {string[]}
 */
function getRowCells(row) {
	return COLS.map((col) => col + row);
}

/**
 * @param {string} key
 * @returns {string[]}
 */
function getMajorDiagonalCells() {
	return COLS.map((row, i) => {
		return row + (i + 1);
	});
}

function getMinorDiagonalCells() {
	return COLS.map((row, i) => {
		return row + (5 - i);
	});
}

/**
 * @param {string} col name of column
 * @returns {string[]}
 */
function getColumnCells(col) {
	return [1, 2, 3, 4, 5].map((row) => col + row);
}

/**
 * @param {string[]} bingoCells list of cells to check
 * @param {object} clickedCells maps clicked cell keys to bools
 * @param {string} key
 * @returns {boolean}
 */
function checkBingo(bingoCells, clickedCells, key) {
	for(let cell of bingoCells) {
		if(cell !== key && !(cell in clickedCells)) {
			return false;
		}
	}
	return true;
}

/**
 * @param {object} clickedCells maps clicked cell keys to bools
 * @param {string} key
 * @returns {boolean}
 */
function checkRowBingo(clickedCells, key) {
	const row = key[1];
	const bingoCells = getRowCells(row);
	return checkBingo(bingoCells, clickedCells, key);
}

/**
 * @param {object} clickedCells maps clicked cell keys to bools
 * @param {string} key
 * @returns {boolean}
 */
function checkColumnBingo(clickedCells, key) {
	const col = key[0];
	const bingoCells = getColumnCells(col);
	return checkBingo(bingoCells, clickedCells, key);
}

/**
 * @param {object} clickedCells maps clicked cell keys to bools
 * @param {string} key
 * @returns {boolean}
 */
function checkMajorDiagonalBingo(clickedCells, key) {
	const bingoCells = getMajorDiagonalCells();
	return checkBingo(bingoCells, clickedCells, key);
}

/**
 * @param {object} clickedCells maps clicked cell keys to bools
 * @param {string} key
 * @returns {boolean}
 */
function checkMinorDiagonalBingo(clickedCells, key) {
	const bingoCells = getMinorDiagonalCells();
	return checkBingo(bingoCells, clickedCells, key);
}

export default class BingoCard extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			subset: [],
			clickedCells: {
				// free cell always in clicked cells
				"N3": true
			},

			// derived state
			bingoCells: [],

			// UI thing
			isBingo: false,

			// mechanism to avoid regeneration of bingo card on each click
			subsetHash: "",
			genSeed: 1,
		};

		this.resetClicked = this.resetClicked.bind(this);
		this.onCellClicked = this.onCellClicked.bind(this);
		this.onGenClick = this.onGenClick.bind(this);
	}

	/**
	 * @param {string} key 2 chars: name of column + 1-indexed row
	 */
	onCellClicked(key) {
		if(!(key in this.state.clickedCells)) {
			// console.log("clicked cell " + key + " for the first time");
			// add to clicked cells
			const newItem = {};
			newItem[key] = true;
			const clickedCells = Object.assign({}, this.state.clickedCells, newItem);
			let bingoCells = [];
			let isBingo = false;

			// check whether we're at GAME OVER
			// just check current row and column
			if(checkRowBingo(clickedCells, key)) {
				isBingo = true;
				bingoCells = [...bingoCells, ...getRowCells(key[1])];
			}
			// deliberately not elseif
			if(checkColumnBingo(clickedCells, key)) {
				isBingo = true;
				bingoCells = [...bingoCells, ...getColumnCells(key[0])];
			}
			// deliberately not elseif
			if(checkMajorDiagonalBingo(clickedCells, key)) {
				isBingo = true;
				bingoCells = [...bingoCells, ...getMajorDiagonalCells()];
			}
			// deliberately not elseif
			if(checkMinorDiagonalBingo(clickedCells, key)) {
				isBingo = true;
				bingoCells = [...bingoCells, ...getMinorDiagonalCells()];
			}

			this.setState({
				clickedCells: clickedCells,
				bingoCells: bingoCells,
				isBingo: isBingo
			});
		}
	}

	resetClicked() {
		this.setState({
			clickedCells: {"N3": true},
			bingoCells: []
		});
	}

	static getDerivedStateFromProps(props, state) {
		// keep calm and carry on
		let hash = computeArrayHash(props.phrases, state.genSeed);
		if(hash !== state.subsetHash) {
			const phrasesSubset = randomSubset(props.phrases, 24);
			return {
				subset: phrasesSubset,
				subsetHash: hash
			};
		} else {
			return {};
		}
	}

	onGenClick(event) {
		event.preventDefault();
		// step 1 -> genSeed += 1
		const genSeed = this.state.genSeed + 1;
		const phrasesSubset = randomSubset(this.props.phrases, 24);
		let hash = computeArrayHash(this.props.phrases, genSeed);

		this.setState({
			subset: phrasesSubset,
			genSeed: genSeed,
			subsetHash: hash,
			clickedCells: {"N3": true},
			bingoCells: []
		});
	}

	render() {
		return (<div id="grid-wrapper">
			<button className="btn btn-success" type="button" id="back-to-phrases-btn"
				onClick={ this.props.onBack }>Back to phrases</button>
			<BingoGrid phrases={ this.state.subset }
				clickedCells={this.state.clickedCells}
				bingoCells={this.state.bingoCells}
				handleCellClicked={this.onCellClicked} />

			<button className="btn btn-warning btn reset-clicked-cells-btn" type="button"
				onClick={ this.resetClicked }>Reset Clicked Cells</button>
			<button className="btn btn-primary btn gen-grid-btn" type="button"
				onClick={ this.onGenClick }>Generate New Grid</button>
		</div>);
	}
}

BingoCard.propTypes = {
	phrases: PropType.array.isRequired,
	onBack: PropType.func.isRequired
};