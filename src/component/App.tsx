import React, { useState, useCallback } from "react";
import "./App.css";
import Field from "./Field";

const App = () => {
  const [input, setInput] = useState(3);
  const memoizedSetInput = useCallback(
    (gridSize: string) => {
      setInput(parseInt(gridSize));
    },
    [setInput]
  );

  return (
    <div className="App">
      <input
        type="number"
        name="gridSizeInput"
        id="gridSizeInput"
        value={input}
        min={2}
        onChange={(e) => memoizedSetInput(e.target.value)}
      />

      <header>Hello World!</header>
      <Field gridSize={input} />

      <button>Submit</button>
    </div>
  );
};

export default App;
