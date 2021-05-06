import './App.css';
import React from 'react'
import Patterns from './patterns/patterns';
import Sequences from './sequences/sequences';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showSequence: true,
    }
  }

  toggleGame= () => {
    this.setState({
      showSequence: !this.state.showSequence
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav>
            {!this.state.showSequence &&
              <button onClick={() => this.toggleGame()}>
                Sequences
             </button>
             }
            {this.state.showSequence &&
              <button onClick={() => this.toggleGame()}>
                Patterns
            </button>
            }
          </nav>
        </header>

        <div className="content">

          {!this.state.showSequence &&
            <Patterns memorizeTime={15}
              recreateTime={12}
              rows={6}
            ></Patterns>}

          {this.state.showSequence &&
            <Sequences
              memorizeTime={10}
              rows={6}
            ></Sequences>}
        </div>
      </div>
    );
  }
}

