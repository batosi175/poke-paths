import React, { useState, useEffect } from "react";
import Field from "./Field";
import { fetchPath } from "../api/PokePathsRepository";
import { InputWithButtons } from "./InputWithButtons";
import { Grid, makeStyles, createStyles, Paper } from "@material-ui/core";
import { ErrorBanner } from "./ErrorBanner";
import {
  TileProps,
  PokePathPostBody,
  ServerPathResponse,
  ErrorResponse,
} from "../model/Models";
import { TileEnum } from "../model/Enums";
import {
  initialGridState,
  resetPath,
  handleGridValidation,
  findAllCoordinatesByTileType,
  applyMoves,
} from "../Utils/AppUtils";
import { InfoPanel } from "./InfoPanel";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      paddingTop: "50px",
    },
    paper: {
      backgroundColor: "#fff",
      padding: "15px",
      margin: "15px",
      marginTop: "0px",
    },
    centered: {
      textAlign: "center",
    },
    outerGridItem: {
      flex: "1 0 200px",
      flexDirection: "column",
      justifyContent: "center",
    },
    submitButton: {
      flex: "1 0 auto",
    },
    fullWidthGridItem: {
      flexDirection: "column",
      justifyContent: "center",
    },
  })
);

const App = () => {
  const classes = useStyles();
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

  const handleSetGridSize = (value: number) => {
    if (value >= 2) {
      setGridSize(value);
    } else {
      setErrors(["You need a minimum grid size of two"]);
    }
  };

  const handleClearGrid = () => {
    setGrid(initialGridState(gridSize));
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
    <Grid container className={classes.root} spacing={1} justify="space-around">
      <Grid item className={classes.fullWidthGridItem} container>
        <Paper className={classes.paper} elevation={2}>
          <InfoPanel />
        </Paper>
      </Grid>
      <Grid item className={classes.outerGridItem} container>
        <Paper className={classes.paper} elevation={2}>
          <Field grid={grid} click={handleTileClick} />
        </Paper>
      </Grid>
      <Grid item className={classes.outerGridItem} container>
        {/* <Paper className={classes.paper} elevation={2}>
          <TileSelector />
        </Paper> */}
        <Paper className={classes.paper} elevation={2}>
          <InputWithButtons
            setGridSize={handleSetGridSize}
            clearGrid={handleClearGrid}
            findPath={handleSubmit}
          />
        </Paper>

        {/* <Paper
          className={[classes.paper, classes.centered].join(" ")}
          elevation={2}
        >
          <Button
            className={classes.submitButton}
            onClick={handleSubmit}
            variant="outlined"
            color="primary"
          >
            Find Path
          </Button>
        </Paper> */}
      </Grid>
      <ErrorBanner errors={errorList} clearErrors={clearErrors} />
    </Grid>
  );
};

export default App;
