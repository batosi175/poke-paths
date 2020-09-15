import { TileProps, Coordinate } from "../model/Models";
import { TileEnum } from "../model/Enums";

// sets our initial state for the grid
// ex:[
//   [{value: 0, isPath:false}, {value: 0, isPath:false}, {value: 0, isPath:false}],
//   [{value: 0, isPath:false}, {value: 0, isPath:false}, {value: 0, isPath:false}],
//   [{value: 0, isPath:false}, {value: 0, isPath:false}, {value: 0, isPath:false}]
// ]
export const initialGridState = (size: number): TileProps[][] => {
  return Array(size).fill(
    Array(size).fill({ value: TileEnum.GRASS, isPath: false })
  );
};

// slightly less wordy function to make a deep copy of the grid
export const copyGrid = (field: TileProps[][]): TileProps[][] => {
  return JSON.parse(JSON.stringify(field));
};

// will change the isPath properties of every tile to be false
export const resetPath = (field: TileProps[][]): TileProps[][] => {
  const fieldCopy = copyGrid(field);
  fieldCopy.forEach((row) => {
    row.forEach((col) => {
      col.isPath = false;
    });
  });
  return fieldCopy;
};

// will take a grid, a starting position and a set of moves and returns a new grid where the isPath property is set to true if is on the route that comes from the api
export const applyMoves = (
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
export const findAllCoordinatesByTileType = (
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
export const handleGridValidation = (grid: TileProps[][]): string[] => {
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
