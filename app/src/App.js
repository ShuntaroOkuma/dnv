import "./App.css";
import ScriptArea from "./components/ScriptArea";
import MermaidArea from "./components/MermaidArea";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MermaidArea />
        <ScriptArea />
      </header>
    </div>
  );
}

export default App;
