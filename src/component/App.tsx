import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import Field from "./Field";
import { fetchPath } from "../api/PokePathsRepository";

export enum TileEnum {
  "GRASS",
  "OBSTACLE",
  "START",
  "END",
}

enum MoveEnum {
  "D",
  "U",
  "R",
  "L",
}

export interface ServerResponse {
  moves: MoveEnum[];
}

export interface Coordinate {
  x?: number;
  y?: number;
}
export interface PokePathPostBody {
  sideLength: number;
  impassables: Coordinate[];
  startingLoc: Coordinate;
  endingLoc: Coordinate;
}

const initialGridState = (size: number): TileEnum[][] => {
  const state = Array(size).fill(Array(size).fill(TileEnum.GRASS));
  return state;
};

const createPostBody = (
  field: TileEnum[][],
  sideLength: number
): PokePathPostBody => {
  console.log(field);
  let impassables: Coordinate[] = [];
  let startingLoc: Coordinate = {};
  let endingLoc: Coordinate = {};
  field.forEach((row, y) => {
    row.forEach((col, x) => {
      switch (col) {
        case TileEnum.START:
          startingLoc = { x, y };
          break;
        case TileEnum.END:
          endingLoc = { x, y };
          break;
        case TileEnum.OBSTACLE:
          impassables.push({ x, y });
          break;
      }
    });
  });
  return {
    sideLength,
    impassables,
    startingLoc,
    endingLoc,
  };
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
  const [grid, setGrid] = useState<TileEnum[][]>(() =>
    initialGridState(gridSize)
  );

  useEffect(() => {
    // console.log("effect getting called");
    setGrid(Array(gridSize).fill(Array(gridSize).fill(TileEnum.GRASS)));
  }, [gridSize]);

  const memoizedHandleTileClick = useCallback(
    (xPosition: number, yPosition: number) => {
      setGrid((originalGrid) => {
        const gridCopy: TileEnum[][] = JSON.parse(JSON.stringify(originalGrid));
        const enumLength: number = Object.keys(TileEnum).length / 2;
        gridCopy[xPosition][yPosition] =
          (gridCopy[xPosition][yPosition] + 1) % enumLength;
        return gridCopy;
      });
    },
    [setGrid]
  );

  const handleSubmit = async () => {
    const postBody = createPostBody(grid, gridSize);
    console.log(postBody);
    const results: ServerResponse = await fetchPath(postBody);
    console.log(results);
  };

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
      <button onClick={handleSubmit}>Start your adventure</button>
    </div>
  );
};

export default App;
