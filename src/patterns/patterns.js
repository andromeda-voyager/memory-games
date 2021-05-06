import React from 'react'
import random from '../utils/random.js';
import Timer from "../shared/timer";
import './patterns.css'

export default class Patterns extends React.Component {

    constructor(props) {
        super(props);
        this.size = this.props.rows * this.props.rows;
        this.pattern = this.newPattern(this.size * .4);
        this.playerGrid = new Array(this.size).fill(false);
        this.playerCanClick = false;
        this.state = {
            timer: this.props.memorizeTime,
            grid: this.pattern.slice(),
            instructions: "Memorize the pattern",
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
            if (this.playerCanClick) {
                clearInterval(this.timerInterval);
                this.playerCanClick = false;
                this.showPercentageCorrect();

            } else {
                this.playerCanClick = true;
                this.setState({
                    grid: this.playerGrid.slice(),
                    instructions: "Recreate the pattern",
                    timer: this.props.recreateTime,
                });
            }
        }
    }

    showPercentageCorrect() {
        let numCorrect = 0;
        for (let i = 0; i < this.pattern.length; i++) {
            if (this.pattern[i] === this.playerGrid[i]) {
                numCorrect++;
            }
        }
        this.setState({
            instructions: "",
            percentage: Math.floor((numCorrect / this.pattern.length) * 100) + "%"
        });
    }

    handleOnClick(index) {
        if (this.playerCanClick) {
            this.playerGrid[index] = true;
            this.setState({
                grid: this.playerGrid.slice(),
            });
        }
    }

    newGameOnClick() {
        this.pattern = this.selection(this.size * .4);
        this.playerGrid = new Array(this.size).fill(false);
        this.setState({
            timer: this.props.memorizeTime,
            grid: this.pattern.slice(),
            instructions: "Memorize the pattern",
            percentage: undefined,
        });
        this.timerInterval = setInterval(this.updateTimer, 1000);
    }

    render() {
        let squares = [];
        for (let i = 0; i < this.pattern.length; i++) {
            squares.push(<div
                className={this.state.grid[i] === true ? 'square color' : 'square'}
                onClick={() => this.handleOnClick(i)}
                key={i} >
            </div>);
        }
        return (
            <div className="pattern">
                <div className="timer-wrapper">
                    <div className="instructions">{this.state.instructions}</div>
                    {this.state.percentage && this.state.percentage}
                    {this.state.timer > -1 && <Timer time={this.state.timer} />}
                </div>
                <div className='grid pattern'>
                    {squares} </div>
                <button
                    className={this.state.percentage ? undefined : 'hidden'}
                    onClick={() => this.newGameOnClick()}>
                    Reset
                </button>
            </div>

        )
    }
}

