import {
  TileProp,
  PokePathPostBody,
  ServerPathResponse,
  ErrorResponse,
} from "../model/Models";
import {
  handleGridValidation,
  findAllCoordinatesByTileType,
  applyMoves,
} from "../Utils/AppUtils";
import { TileEnum } from "../model/Enums";
import { fetchPath } from "./PokePathsRepository";

export const getPokePath = async (grid: TileProp[][], gridSize: number) => {
  const validationErrors = handleGridValidation(grid);
  if (validationErrors.length) {
    return { errors: validationErrors, grid };
  }

  const postBody: PokePathPostBody = {
    sideLength: gridSize,
    startingLoc: findAllCoordinatesByTileType(grid, TileEnum.START)?.[0],
    endingLoc: findAllCoordinatesByTileType(grid, TileEnum.END)?.[0],
    impassables: findAllCoordinatesByTileType(grid, TileEnum.OBSTACLE),
  };

  const results: ServerPathResponse | ErrorResponse = await fetchPath(postBody);

  // type guard for error checking from server so we can handle errors
  const errorResponse = results as ErrorResponse;
  const successResponse = results as ServerPathResponse;
  if (errorResponse.message) {
    return { errors: [errorResponse.message], grid };
  } else {
    return {
      errors: [],
      grid: applyMoves(grid, postBody.startingLoc, successResponse.moves),
    };
  }
};
