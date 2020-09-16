import React, { useState, useEffect, useCallback } from "react";
import Field from "./Field";
import { ControlPanel } from "./ControlPanel";
import { Grid, makeStyles, createStyles, Paper } from "@material-ui/core";
import { ErrorBanner } from "./ErrorBanner";
import { TileProp } from "../model/Models";
import { TileEnum } from "../model/Enums";
import { initialGridState, resetPath } from "../Utils/AppUtils";
import { InfoPanel } from "./InfoPanel";
import { getPokePath } from "../api/PokePathsClient";

// using JSS hook that came with Material-UI for styles
const useStyles = makeStyles(() =>
  createStyles({
    sidebar: {
      position: "fixed",
      width: "300px",
      height: "100%",
      overflowY: "auto",
      paddingTop: "15px",
    },
    gridArea: {
      display: "flex",
      marginLeft: "300px",
      paddingTop: "15px",
    },
    paper: {
      backgroundColor: "#fff",
      padding: "15px",
      margin: "15px",
      marginTop: "0px",
    },
  })
);

const App = () => {
  const classes = useStyles();
  const [gridSize, setGridSize] = useState(3);
  const [errorList, setErrors] = useState([] as string[]);
  const [grid, setGrid] = useState<TileProp[][]>(() =>
    initialGridState(gridSize)
  );

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, [setErrors]);

  // reset's the grid whenever the gridsize property is updated and clear's out errors
  useEffect(() => {
    setGrid(initialGridState(gridSize));
    clearErrors();
  }, [gridSize, clearErrors]);

  // when the grid is interacted with, we clear errors and set the grid based on the selection
  // we use useCallback to pass down a memoized function to prevent additional render when props change in the memoized Field and Tile components
  const handleTileClick = useCallback(
    (xPosition: number, yPosition: number) => {
      clearErrors();
      setGrid((originalGrid) => {
        const newGrid: TileProp[][] = resetPath(originalGrid);
        const enumLength: number = Object.keys(TileEnum).length / 2;
        const currentTile: TileProp = newGrid[xPosition][yPosition];
        const tileValue = (currentTile.value + 1) % enumLength;
        newGrid[xPosition][yPosition].value = tileValue;
        return newGrid;
      });
    },
    [setGrid, clearErrors]
  );

  // we get a size from the input and buttons component and if we get a value less than 2 for the size, we send an error out instead
  const handleSetGridSize = (value: number) => {
    if (value >= 2) {
      setGridSize(value);
    } else {
      setErrors(["You need a minimum grid size of two"]);
    }
  };

  // quick way to clear the grid to the initial state for the current size
  const handleClearGrid = () => {
    setGrid(initialGridState(gridSize));
  };

  // get path from api and set any validation or api errors
  const handleSubmit = async () => {
    const { errors: _errors, grid: _grid } = await getPokePath(grid, gridSize);
    setErrors(_errors);
    setGrid(_grid);
  };

  return (
    <>
      <div className={classes.sidebar}>
        <Paper className={classes.paper} elevation={2}>
          <InfoPanel />
        </Paper>
        <Paper className={classes.paper} elevation={2}>
          <ControlPanel
            setGridSize={handleSetGridSize}
            clearGrid={handleClearGrid}
            findPath={handleSubmit}
          />
        </Paper>
      </div>
      <Grid className={classes.gridArea}>
        <Paper className={classes.paper} elevation={2}>
          <Field grid={grid} click={handleTileClick} />
        </Paper>
      </Grid>
      <ErrorBanner errors={errorList} clearErrors={clearErrors} />
    </>
  );
};

export default App;
