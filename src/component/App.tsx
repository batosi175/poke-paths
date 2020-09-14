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

export interface ErrorResponse {
  message: string;
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

const findAllCoordinatesByTileType = (
  field: TileProps[][],
  type: TileEnum
): Coordinate[] => {
  let coordinates: Coordinate[] = [];
  field.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col.value === type) {
        coordinates.push({ x, y });
      }
    });
  });
  return coordinates;
};

const App = () => {
  const [gridSize, setGridSize] = useState(3); // what we get from the input
  const [errorList, setErrors] = useState([] as string[]); // array of error strings

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
    setGrid(initialGridState(gridSize));
    setErrors([]);
  }, [gridSize]);

  const memoizedHandleTileClick = useCallback(
    (xPosition: number, yPosition: number) => {
      setErrors([]);
      setGrid((originalGrid) => {
        const gridCopy: TileProps[][] = JSON.parse(
          JSON.stringify(originalGrid)
        );
        gridCopy.forEach((row) => {
          row.forEach((col) => {
            col.isPath = false;
          });
        });
        const enumLength: number = Object.keys(TileEnum).length / 2;
        const currentTile: TileProps = gridCopy[xPosition][yPosition];
        gridCopy[xPosition][yPosition] = Object.assign(currentTile, {
          value: (currentTile.value + 1) % enumLength,
        });
        return gridCopy;
      });
    },
    [setGrid, setErrors]
  );

  const handleSubmit = async () => {
    const startingLoc = findAllCoordinatesByTileType(grid, TileEnum.START)?.[0];
    const endingLoc = findAllCoordinatesByTileType(grid, TileEnum.END)?.[0];
    const impassables = findAllCoordinatesByTileType(grid, TileEnum.OBSTACLE);

    const postBody: PokePathPostBody = {
      sideLength: gridSize,
      startingLoc,
      endingLoc,
      impassables,
    };

    const results: ServerPathResponse | ErrorResponse = await fetchPath(
      postBody
    );
    const errorResponse = results as ErrorResponse;
    const successResponse = results as ServerPathResponse;
    if (errorResponse.message) {
      setErrors([errorResponse.message]);
    } else if (successResponse.moves) {
      const position = { ...postBody.startingLoc };
      const gridCopy: TileProps[][] = JSON.parse(JSON.stringify(grid));
      gridCopy[position.y][position.x].isPath = true;
      successResponse.moves.forEach((move: string) => {
        switch (move) {
          case MoveEnum[MoveEnum.U]:
            position.y--;
            break;
          case MoveEnum[MoveEnum.D]:
            position.y++;
            break;
          case MoveEnum[MoveEnum.L]:
            position.x--;
            break;
          case MoveEnum[MoveEnum.R]:
            position.x++;
            break;
        }
        gridCopy[position.y][position.x].isPath = true;
      });
      setGrid(gridCopy);
    }
  };

  return (
    <div className="App">
      <div className="errorList">
        {errorList.map((error, index) => {
          return (
            <div className="errorItem" key={index}>
              {error}
            </div>
          );
        })}
      </div>
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
