import React from 'react'
import './sequences.css'
import random from '../utils/random.js';
import Timer from "../shared/timer";

export default class Sequences extends React.Component {

    constructor(props) {
        super(props);
        this.size = this.props.rows * this.props.rows;
        this.state = {
            lastClicked: 0,
            gameOver: false,
            playerCanClick: false,
            timer: this.props.memorizeTime,
            grid: this.newSequenceGrid(9, this.size),
            message: "Memorize the sequence",
        }
    }

    newSequenceGrid = (sequenceLength) => {
        let grid = new Array(this.size).fill(0);
        while (sequenceLength > 0) {
            let index = random.between(0, this.size);
            if (grid[index] === 0) {
                grid[index] = sequenceLength--;;
            }
        }
        return grid;
    };

    componentDidMount() {
        this.timerInterval = setInterval(this.updateGame, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval);
    }

    updateGame = () => {
        this.updateTimer();
        if (this.state.timer < 0) {
            clearInterval(this.timerInterval);
            this.setState({
                playerCanClick: true,
                message: "Click the squares in sequence",
            });
        }
    }

    updateTimer = () => {
        this.setState({ timer: this.state.timer - 1 });
    }

    playerCanClick() {
        return this.state.playerCanClick && !this.state.gameOver;
    }

    handleOnClick(index) {
        if (this.playerCanClick()) {
            if (this.state.grid[index] > this.state.lastClicked) {
                if (this.state.lastClicked === this.state.grid[index] - 1) {
                    let modifiedGrid = this.state.grid.slice();
                    modifiedGrid[index] = -modifiedGrid[index];
                    this.setState({
                        grid: modifiedGrid.slice(),
                        gameOver: modifiedGrid[index] === -9 ? true : false,
                        lastClicked: this.state.lastClicked + 1,
                    });
                } else {
                    this.setState({
                        gameOver: true,
                    });
                }
            }
        }
    }

    newGameOnClick() {
        this.setState({
            lastClicked: 0,
            gameOver: false,
            playerCanClick: false,
            timer: this.props.memorizeTime,
            grid: this.newSequenceGrid(9, this.size),
            message: "Memorize the sequence",
        });
        this.timerInterval = setInterval(this.updateGame, 1000);
    }

    isNumberHidden(indexValue) {
        return Math.abs(indexValue) === 0
            || (this.state.playerCanClick && indexValue > 0
                && !this.state.gameOver)
    }

    render() {
        let squares = [];
        for (let i = 0; i < this.state.grid.length; i++) {
            squares.push(<div
                className={(this.state.grid[i] < 1 ? 'square' : 'square color')
                    + (this.state.playerCanClick && this.state.grid[i] > 0 ? ' player' : '')}
                onClick={() => this.handleOnClick(i)}
                key={i} >
                <span className={this.isNumberHidden(this.state.grid[i]) ? 'number hidden' : 'number'}>
                    {Math.abs(this.state.grid[i])}
                </span>
            </div>);
        }
        return (
            <div className="sequence">
                <div className="timer-message-container">
                    <div className="message">{!this.state.gameOver && this.state.message}</div>
                    {this.state.gameOver &&
                        <span>
                            {this.state.lastClicked === 9 ? "Great job!"
                                : this.state.lastClicked + " correct"}
                        </span>}
                    <Timer time={this.state.timer} />
                </div>
                <div className="grid">
                    {squares}
                </div>
                <button
                    className={this.state.gameOver ? undefined : 'hidden'}
                    onClick={() => this.newGameOnClick()}>
                    Reset
                </button>

            </div>

        )
    }
}

