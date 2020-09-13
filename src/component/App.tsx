import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import Field from "./Field";

export enum TileProps {
  "GRASS",
  "OBSTACLE",
  "START",
  "END",
}

const initialGridState = (size: number): TileProps[][] => {
  const state = Array(size).fill(Array(size).fill(TileProps.GRASS));
  return state;
};

const App = () => {
  const [gridSize, setGridSize] = useState(3); // what we get from the input
  const memoizedSetGridSize = useCallback(
    // more efficient way of handling this
    (gridSize: string) => {
      setGridSize(parseInt(gridSize));
    },
    [setGridSize]
  );

  // grid that goes to the field for renders
  const [grid, setGrid] = useState<TileProps[][]>(() =>
    initialGridState(gridSize)
  );

  useEffect(() => {
    // console.log("effect getting called");
    setGrid(Array(gridSize).fill(Array(gridSize).fill(TileProps.GRASS)));
  }, [gridSize]);

  const memoizedHandleTileClick = useCallback(
    (xPosition: number, yPosition: number) => {
      const gridCopy: TileProps[][] = JSON.parse(JSON.stringify(grid));
      const enumLength: number = Object.keys(TileProps).length / 2;
      gridCopy[xPosition][yPosition] =
        (gridCopy[xPosition][yPosition] + 1) % enumLength;
      setGrid(gridCopy);
    },
    [grid, setGrid]
  );

  return (
    <div className="App">
      <input
        type="number"
        name="gridSizeInput"
        id="gridSizeInput"
        value={gridSize}
        min={2}
        onChange={(e) => memoizedSetGridSize(e.target.value)}
      />

      <Field grid={grid} click={memoizedHandleTileClick} />
      <button>Submit</button>
    </div>
  );
};

export default App;
