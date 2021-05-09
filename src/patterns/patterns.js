import React from 'react'
import random from '../utils/random.js';
import Timer from "../shared/timer";
import './patterns.css'

const GameStatus = Object.freeze({ "MEMORIZE": 1, "MATCH": 2, "OVER": 3 });

export default class Patterns extends React.Component {

    constructor(props) {
        super(props);
        this.size = this.props.rows * this.props.rows;
        this.state = {
            gameStatus: GameStatus.MEMORIZE,
            timer: this.props.memorizeTime,
            patternGrid: this.newPattern(this.size * .4),
            playerGrid: new Array(this.size).fill(false),
            message: "Memorize the pattern",
        }
    }

    newPattern = (patternSize) => {
        let pattern = new Array(this.size).fill(false);
        let count = 0;
        while (count < patternSize) {
            let index = random.between(0, this.size);
            if (pattern[index] === false) {
                pattern[index] = true;
                count++;
            }
        }
        return pattern;
    };

    componentDidMount() {
        this.timerInterval = setInterval(this.updateTimer, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval);
    }

    updateTimer = () => {
        this.setState({ timer: this.state.timer - 1 });
        if (this.state.timer < 0) {
            if (this.state.gameStatus === GameStatus.MATCH) {
                clearInterval(this.timerInterval);
                this.setState({
                    gameStatus: GameStatus.OVER,
                    message: this.getPercentageCorrect(),
                });
            } else {
                this.setState({
                    gameStatus: GameStatus.MATCH,
                    message: "Recreate the pattern",
                    timer: this.props.recreateTime,
                });
            }
        }
    }

    getPercentageCorrect() {
        let numCorrect = 0;
        for (let i = 0; i < this.state.patternGrid.length; i++) {
            if (this.state.patternGrid[i] === this.state.playerGrid[i]) {
                numCorrect++;
            }
        }

        return Math.floor((numCorrect / this.state.patternGrid.length) * 100) + "%"

    }

    handleOnClick(index) {
        if (this.state.gameStatus === GameStatus.MATCH) {
            let modifiedGrid = this.state.playerGrid.slice();
            modifiedGrid[index] = !modifiedGrid[index];
            this.setState({
                playerGrid: modifiedGrid.slice(),
            });
        }
    }

    newGameOnClick() {
        this.setState({
            gameStatus: GameStatus.MEMORIZE,
            timer: this.props.memorizeTime,
            patternGrid: this.newPattern(this.size * .4),
            playerGrid: new Array(this.size).fill(false),
            message: "Memorize the pattern",
        });
        this.timerInterval = setInterval(this.updateTimer, 1000);
    }

    render() {
        let playerSquares = [];
        let patternSquares = [];
        for (let i = 0; i < this.state.patternGrid.length; i++) {
            patternSquares.push(<div
                className={this.state.patternGrid[i] === true ? 'square color' : 'square'}
                key={i} >
            </div>);

            playerSquares.push(<div
                className={this.state.playerGrid[i] === true ? 'square color player' : 'player square'}
                onClick={() => this.handleOnClick(i)}
                key={i} >
            </div>);
        }
        return (
            <div className="pattern">
                <div className="timer-message-container">
                    <div className="message">{this.state.message}</div>
                    {this.state.gameStatus !== GameStatus.OVER && <Timer time={this.state.timer} />}
                </div>
                {this.state.gameStatus === GameStatus.OVER && <span>Original Pattern</span>}

                <div className=
                    {
                        this.state.gameStatus !== GameStatus.OVER
                            ? 'single grid-container' : 'double grid-container'
                    }>
                    {this.state.gameStatus !== GameStatus.MATCH &&
                        <div className='grid pattern'>
                            {patternSquares}
                        </div>
                    }
                    {this.state.gameStatus !== GameStatus.MEMORIZE &&
                        <div className='grid pattern'>
                            {playerSquares}
                        </div>
                    }
                </div>
                <button
                    className={this.state.gameStatus === GameStatus.OVER ? undefined : 'hidden'}
                    onClick={() => this.newGameOnClick()}>
                    Reset
                </button>
            </div>

        )
    }
}

