import React, { useState, useEffect } from "react";
import "./App.css";
import Field from "./Field";
import { fetchPath } from "../api/PokePathsRepository";
import { InputWithButton } from "./InputWithButton";
import { Button } from "@material-ui/core";
import { ErrorBanner } from "./ErrorBanner";

// enum that manages what the tile values are
export enum TileEnum {
  "GRASS",
  "OBSTACLE",
  "START",
  "END",
}

// The props that are sent down to the grid and the tile component is array indexed starting from top left to bottom right.
export interface TileProps {
  value: TileEnum;
  isPath: boolean;
}

// possible moves that come from the server
export enum MoveEnum {
  "D", // Down
  "U", // Up
  "R", // Right
  "L", // Left
}

// expected payload for poke paths endpoint
export interface ServerPathResponse {
  moves: string[];
}

// expected error when we have an impossibe path
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

// sets our initial state for the grid
// ex:[
//   [{value: 0, isPath:false}, {value: 0, isPath:false}, {value: 0, isPath:false}],
//   [{value: 0, isPath:false}, {value: 0, isPath:false}, {value: 0, isPath:false}],
//   [{value: 0, isPath:false}, {value: 0, isPath:false}, {value: 0, isPath:false}]
// ]
const initialGridState = (size: number): TileProps[][] => {
  return Array(size).fill(
    Array(size).fill({ value: TileEnum.GRASS, isPath: false })
  );
};

// slightly less wordy function to make a deep copy of the grid
const copyGrid = (field: TileProps[][]): TileProps[][] => {
  return JSON.parse(JSON.stringify(field));
};

// will change the isPath properties of every tile to be false
const resetPath = (field: TileProps[][]): TileProps[][] => {
  const fieldCopy = copyGrid(field);
  fieldCopy.forEach((row) => {
    row.forEach((col) => {
      col.isPath = false;
    });
  });
  return fieldCopy;
};

// will take a grid, a starting position and a set of moves and returns a new grid where the isPath property is set to true if is on the route that comes from the api
const applyMoves = (
  field: TileProps[][],
  startingPosition: Coordinate,
  moves: string[]
): TileProps[][] => {
  const newField: TileProps[][] = copyGrid(field);
  newField[startingPosition.y][startingPosition.x].isPath = true;
  let currentPosition: Coordinate = { ...startingPosition };
  moves.forEach((move: string) => {
    // using string values instead of enum values for ledgibility
    switch (move) {
      case "U":
        currentPosition.y--;
        break;
      case "D":
        currentPosition.y++;
        break;
      case "L":
        currentPosition.x--;
        break;
      case "R":
        currentPosition.x++;
        break;
    }
    newField[currentPosition.y][currentPosition.x].isPath = true;
  });
  return newField;
};

// this takes in a grid and one of the TileEnums, and will search through the grid and return all matching entries coordiantes or will return an empty array.
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

// for validation we check to see if we have less than or more than 1 starting location and ending location.
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

  // reset's the grid whenever the gridsize property is updated and clear's out errors
  useEffect(() => {
    setGrid(initialGridState(gridSize));
    clearErrors();
  }, [gridSize]);

  const clearErrors = () => {
    setErrors([]);
  };

  // when the grid is interacted with, we clear errors and set the grid based on the selection
  const handleTileClick = (xPosition: number, yPosition: number) => {
    clearErrors();
    setGrid((originalGrid) => {
      const newGrid: TileProps[][] = resetPath(originalGrid);
      const enumLength: number = Object.keys(TileEnum).length / 2;
      const currentTile: TileProps = newGrid[xPosition][yPosition];
      const tileValue = (currentTile.value + 1) % enumLength;
      newGrid[xPosition][yPosition].value = tileValue;
      return newGrid;
    });
  };

  const handleSubmit = async () => {
    const validationErrors = handleGridValidation(grid);
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }

    const postBody: PokePathPostBody = {
      sideLength: gridSize,
      startingLoc: findAllCoordinatesByTileType(grid, TileEnum.START)?.[0],
      endingLoc: findAllCoordinatesByTileType(grid, TileEnum.END)?.[0],
      impassables: findAllCoordinatesByTileType(grid, TileEnum.OBSTACLE),
    };

    const results: ServerPathResponse | ErrorResponse = await fetchPath(
      postBody
    );
    // type guard for error checking from server
    const errorResponse = results as ErrorResponse;
    const successResponse = results as ServerPathResponse;
    if (errorResponse.message) {
      setErrors([errorResponse.message]);
    } else if (successResponse.moves) {
      setGrid(applyMoves(grid, postBody.startingLoc, successResponse.moves));
    }
  };

  return (
    <div className="App">
      <InputWithButton setGridSize={setGridSize} />
      <Field grid={grid} click={handleTileClick} />
      <Button onClick={handleSubmit} variant="outlined" color="primary">
        Start your adventure
      </Button>

      <ErrorBanner errors={errorList} clearErrors={clearErrors} />
    </div>
  );
};

export default App;
