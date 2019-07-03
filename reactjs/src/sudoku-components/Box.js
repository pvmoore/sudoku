import React, { Component } from 'react'
import Cell from "./Cell";
import PropTypes from "prop-types";
import "./Box.css";

class Box extends Component {

    render() {
        //console.log("Box.render");
        const box = this.props.box;
        const boxStr = `b${box}`;
        return (
            /** Propagate cellClicked action to Board */
            <div id={boxStr} className="box">
                <Cell row={0} col={0} box={box} />
                <Cell row={0} col={1} box={box} />
                <Cell row={0} col={2} box={box} />
                <Cell row={1} col={0} box={box} />
                <Cell row={1} col={1} box={box} />
                <Cell row={1} col={2} box={box} />
                <Cell row={2} col={0} box={box} />
                <Cell row={2} col={1} box={box} />
                <Cell row={2} col={2} box={box} />
            </div >
        );
    }
}

Box.propTypes = {
    box: PropTypes.number.isRequired
};

export default Box;
