import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setSelectedCell } from "./redux/actions";

import "./Cell.css";

class Cell extends Component {

    /** Properties known at mount time */
    row = this.props.row + Math.trunc(this.props.box / 3) * 3;
    col = this.props.col + Math.trunc(this.props.box % 3) * 3;
    pos = this.row * 9 + this.col;

    render() {
        const cell = this.props.cells[this.pos];

        const r = this.props.row + 1;
        const c = this.props.col + 1;

        let value = "";
        let scratch = "";

        if(cell.value) {
            value = cell.value === 0 ? "" : "" + cell.value;
        }
        if(cell.scratch) {
            scratch = cell.scratch.join();
        }

        const id = `cell${this.pos}`;
        const divClassName = `cell row${this.row} col${this.col} r${r} c${c}`;
        const valueClassName = "value" + (cell.isUser ? " userPlaced" : "");

        return (
            <div id={id} className={divClassName} onMouseDown={this.cellClicked}>
                <div className={valueClassName}>{value}</div>
                <div className="scratch">{scratch}</div>
            </div>
        )
    }
    componentDidUpdate(prevProps, prevState) {
        const div = document.getElementById(`cell${this.pos}`);

        if(this.props.selectedCell === this.pos) {
            div.classList.add("selected");
        } else {
            div.classList.remove("selected");
        }
    }
    cellClicked = e => {
        /** Ignore the event if isUser is false */
        const cell = this.props.cells[this.pos];
        if(cell.isUser) {

            if(this.props.selectedCell === this.pos) {
                this.props.dispatch(setSelectedCell(null));
            } else {
                this.props.dispatch(setSelectedCell(this.pos));
            }
        }
    }
}

Cell.propTypes = {
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
    box: PropTypes.number.isRequired
};

const mapStateToProps = (state) => {
    return { cells: state.cells, selectedCell: state.selectedCell };
};

export default connect(mapStateToProps)(Cell);
