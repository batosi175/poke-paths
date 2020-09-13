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

export interface TileProps {
  value: TileEnum;
  isPath: boolean;
}

export enum MoveEnum {
  "D",
  "U",
  "R",
  "L",
}

export interface ServerPathResponse {
  moves: string[];
}

export interface Coordinate {
  x: number;
  y: number;
}
export interface PokePathPostBody {
  sideLength: number;
  impassables: Coordinate[];
  startingLoc: Coordinate;
  endingLoc: Coordinate;
}

const initialGridState = (size: number): TileProps[][] => {
  return Array(size).fill(
    Array(size).fill({ value: TileEnum.GRASS, isPath: false })
  );
};

const createPostBody = (
  field: TileProps[][],
  sideLength: number
): PokePathPostBody => {
  // console.log(field);
  let impassables: Coordinate[] = [];
  // TODO: Do soemthign about this
  let startingLoc: Coordinate = { x: 0, y: 0 };
  let endingLoc: Coordinate = { x: 0, y: 0 };
  field.forEach((row, y) => {
    row.forEach((col, x) => {
      switch (col.value) {
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
  const [grid, setGrid] = useState<TileProps[][]>(() =>
    initialGridState(gridSize)
  );

  useEffect(() => {
    // console.log("effect getting called");
    setGrid(initialGridState(gridSize));
  }, [gridSize]);

  const memoizedHandleTileClick = useCallback(
    (xPosition: number, yPosition: number) => {
      setGrid((originalGrid) => {
        const gridCopy: TileProps[][] = JSON.parse(
          JSON.stringify(originalGrid)
        );
        const enumLength: number = Object.keys(TileEnum).length / 2;
        const currentTile: TileProps = gridCopy[xPosition][yPosition];
        gridCopy[xPosition][yPosition] = Object.assign(currentTile, {
          value: (currentTile.value + 1) % enumLength,
        });
        return gridCopy;
      });
    },
    [setGrid]
  );

  const handleSubmit = async () => {
    const postBody = createPostBody(grid, gridSize);
    // console.log(postBody);
    const results: ServerPathResponse = await fetchPath(postBody);
    console.log(results.moves);
    // we need to take the grid and apply the update.
    const position = { ...postBody.startingLoc };
    const gridCopy: TileProps[][] = JSON.parse(JSON.stringify(grid));
    gridCopy[position.x][position.y].isPath = true;
    results.moves.forEach((move: string) => {
      console.log(move);
      switch (move) {
        case MoveEnum[MoveEnum.U]:
          position.y--;
          break;
        case MoveEnum[MoveEnum.D]:
          console.log("here");

          position.y++;
          break;
        case MoveEnum[MoveEnum.L]:
          position.x--;
          break;
        case MoveEnum[MoveEnum.R]:
          position.x++;
          break;
      }
      console.log(position);

      gridCopy[position.x][position.y].isPath = true;
    });
    console.log(gridCopy);
    setGrid(gridCopy);
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
