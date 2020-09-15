import { TileEnum } from "./Enums";

// The props that are sent down to the grid and the tile component is array indexed starting from top left to bottom right.
export interface TileProp {
  value: TileEnum;
  isPath: boolean;
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
