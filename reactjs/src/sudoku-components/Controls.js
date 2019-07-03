import React, { Component } from 'react'
import "./Controls.css";
import PropTypes from 'prop-types'

class Controls extends Component {

    render() {
        return (
            <div id="controls"><button onClick={this.props.newGame}>New Game</button></div>
        )
    }
}

Controls.propTypes = {
    newGame: PropTypes.func
};

export default Controls;
