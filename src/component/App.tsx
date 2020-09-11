import React from "react";
import "./App.css";
import Field from "./Field";

const App = () => {
  return (
    <div className="App">
      <input type="number" name="gridSizeInput" id="gridSizeInput" />
      <header>Hello World!</header>
      <Field />

      <button>Submit</button>
    </div>
  );
};

export default App;
