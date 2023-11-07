import "./App.css";
import ScriptArea from "./components/ScriptArea";
import MermaidArea from "./components/MermaidArea";
import { Divider } from "@mui/material";

function App() {
  return (
    <div className="App">
      <MermaidArea />
      <Divider />
      <ScriptArea />
    </div>
  );
}

export default App;
