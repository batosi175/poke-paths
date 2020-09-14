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

const copyGrid = (field: TileProps[][]): TileProps[][] => {
  return JSON.parse(JSON.stringify(field));
};

const resetPath = (field: TileProps[][]): TileProps[][] => {
  const fieldCopy = copyGrid(field);
  fieldCopy.forEach((row) => {
    row.forEach((col) => {
      col.isPath = false;
    });
  });
  return fieldCopy;
};

const applyMoves = (
  field: TileProps[][],
  startingPosition: Coordinate,
  moves: string[]
): TileProps[][] => {
  const newField: TileProps[][] = copyGrid(field);
  newField[startingPosition.y][startingPosition.x].isPath = true;
  moves.forEach((move: string) => {
    switch (move) {
      case MoveEnum[MoveEnum.U]:
        startingPosition.y--;
        break;
      case MoveEnum[MoveEnum.D]:
        startingPosition.y++;
        break;
      case MoveEnum[MoveEnum.L]:
        startingPosition.x--;
        break;
      case MoveEnum[MoveEnum.R]:
        startingPosition.x++;
        break;
    }
    newField[startingPosition.y][startingPosition.x].isPath = true;
  });
  return newField;
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

const handleGridValidation = (grid: TileProps[][]): string[] => {
  const startingLocations = findAllCoordinatesByTileType(grid, TileEnum.START);
  const endingLocations = findAllCoordinatesByTileType(grid, TileEnum.END);

  const messageList: string[] = [];

  if (startingLocations.length === 0) {
    messageList.push("You need at least one starting tile");
  } else if (startingLocations.length > 1) {
    messageList.push("You may only have up to one starting tile");
  }
  if (endingLocations.length === 0) {
    messageList.push("You need at least one ending tile");
  } else if (endingLocations.length > 1) {
    messageList.push("You may only have up to one ending tile");
  }
  return messageList;
};

const App = () => {
  const [gridSize, setGridSize] = useState(3);
  const [errorList, setErrors] = useState([] as string[]);
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
        const newGrid: TileProps[][] = resetPath(originalGrid);
        const enumLength: number = Object.keys(TileEnum).length / 2;
        const currentTile: TileProps = newGrid[xPosition][yPosition];
        const tileValue = (currentTile.value + 1) % enumLength;
        newGrid[xPosition][yPosition].value = tileValue;
        return newGrid;
      });
    },
    [setGrid, setErrors]
  );

  const handleSubmit = async () => {
    const validationErrors = handleGridValidation(grid);

    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }
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
      setGrid(applyMoves(grid, startingLoc, successResponse.moves));
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
        onChange={(e) => setGridSize(parseInt(e.target.value))}
      />
      <Field grid={grid} click={memoizedHandleTileClick} />
      <button onClick={handleSubmit}>Start your adventure</button>
    </div>
  );
};

export default App;
