import React from 'react';
import Box from "./Box";
import { connect } from "react-redux";
//import { updateCell, setSelectedCell } from "./redux/actions";

import "./Board.css";

class Board extends React.Component {

    render() {
        return (
            <div id="board">
                <Box box={0} />
                <Box box={1} />
                <Box box={2} />
                <Box box={3} />
                <Box box={4} />
                <Box box={5} />
                <Box box={6} />
                <Box box={7} />
                <Box box={8} />
            </div>
        );
    }
    componentDidUpdate(prevProps, prevState) {
        const cells = JSON.stringify(this.props.cells);
        localStorage.setItem("currentGame-reactjs", cells);
    }
}

const mapStateToProps = (state) => {
    return { cells: state.cells, selectedCell: state.selectedCell };
};

export default connect(mapStateToProps)(Board);