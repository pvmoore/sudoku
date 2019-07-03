import React, { Component } from 'react'
import Board from './Board'
import Controls from './Controls'
import SelectNumber from './SelectNumber'
import { connect } from "react-redux";
import { newGame } from "./redux/actions";

import "./Sudoku.css";

class Sudoku extends Component {

    render() {
        return (
            <div id="sudoku">
                <div id="heading">Sudoku (React)</div>

                <div id="container">
                    <Board />
                    <SelectNumber />
                    <Controls newGame={this.newGame} />

                </div>
            </div>
        )
    }
    newGame = () => {
        this.props.dispatch(newGame());
    }
}

const mapStateToProps = (state) => {
    return { cells: state.cells, selectedCell: state.selectedCell };
};

export default connect(mapStateToProps)(Sudoku);
