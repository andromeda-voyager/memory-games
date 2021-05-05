import './App.css';
import Pattern from './pattern/pattern';
import Sequence from './sequence/sequence';
function App() {
  return (
    <div className="App">
      <header className="App-header">

      </header>
      {/* <Pattern memorizeTime={15}
        recreateTime={15}
        rows={7}
      ></Pattern> */}
      <Sequence
      memorizeTime={3}
      recreateTime={3}
      rows={6}
      ></Sequence>
    </div>
  );
}

export default App;
