import React, { Component } from 'react'
import { connect } from "react-redux";
import { setValue, setScratch, setSelectedCell } from './redux/actions'
import "./SelectNumber.css";

class SelectNumber extends Component {

    render() {
        const fragment = (
            <React.Fragment>
                <div id="selection" onClick={this._valueClicked}>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                </div>
                <div id="scratch" onClick={this._scratchClicked}>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                </div>
            </React.Fragment>
        );
        const isSelectable = this.props.selectedCell !== null;
        const className = isSelectable ? "selectable" : "";
        return (
            <div id="select-number" className={className}>
                {isSelectable ? fragment : ""}
            </div>
        )
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.props.selectedCell) {

            /** hide values that don't make sense */
            document.querySelectorAll(".lowlight")
                .forEach(e => e.classList.remove("lowlight"));

            /** Todo */
            const pos = this.props.selectedCell;
            const box = this.props.getBoxIndex(pos);
            const cell = this.props.cells[pos];
            console.assert(cell);

            const scratch = cell.scratch;
            const values = this.props.getBoxValues(box);

            const uiSel = document.getElementById("selection");
            const uiScr = document.getElementById("scratch");
            for(let i = 0; i < 9; i++) {
                if(scratch.includes(i + 1) || values.includes(i + 1)) {
                    uiScr.children[i].classList.add("lowlight");
                }
                if(values.includes(i + 1)) {
                    uiSel.children[i].classList.add("lowlight");
                }
            }
        }
    }

    _valueClicked = (e) => {
        const value = e.target.innerText;
        if(value.length === 1) {
            this.props.dispatch(setValue(this.props.selectedCell, +value));
            this.props.dispatch(setSelectedCell(null));
        }
    }
    _scratchClicked = (e) => {
        const scratch = e.target.innerText;
        if(scratch.length === 1) {
            this.props.dispatch(setScratch(this.props.selectedCell, +scratch));
        }
    }
}

const mapStateToProps = (state) => {
    return state;
};

export default connect(mapStateToProps)(SelectNumber);
