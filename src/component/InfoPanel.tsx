import React from "react";
import { Grid, makeStyles, createStyles, Typography } from "@material-ui/core";
import Tile from "./Tile";
import { TileEnum } from "../model/Enums";

const useStyles = makeStyles(() =>
  createStyles({
    columnCentered: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    legendRow: {
      display: "flex",
      justifyContent: "space-evenly",
      flex: "1 0 25%",
    },
    line: {
      width: "25%",
      margin: "10px",
      borderBottom: "solid 1px rgba(0,0,0,.5)",
    },
  })
);

export const InfoPanel = React.memo(() => {
  const classes = useStyles();
  return (
    <Grid container direction="column">
      <Typography variant="h5" align="center" gutterBottom>
        Instructions
      </Typography>
      <Grid container className={classes.columnCentered}>
        <Typography variant="body1" align="center">
          Click on a tile to toggle It's type between Obstacle, Start, End and
          Grass.
        </Typography>
        <div className={classes.line} />
        <Typography variant="body1" align="center">
          You can change the size by using the input and selecting "Set Size".
        </Typography>
        <div className={classes.line} />
        <Typography variant="body1" align="center">
          "Clear Grid" will set all tiles to grass on the current grid.
        </Typography>
        <div className={classes.line} />
        <Typography variant="body1" align="center">
          "Find path" will highlight a route from start to end, avoiding
          obstacles.
        </Typography>
        <div className={classes.line} />
      </Grid>
      <Grid container justify="center">
        <Typography variant="h5" gutterBottom>
          Legend
        </Typography>
      </Grid>
      <Grid container className={classes.legendRow}>
        <Grid className={classes.columnCentered}>
          <Typography variant="caption">Obstacle</Typography>
          <Tile
            tile={{ value: TileEnum.OBSTACLE, isPath: false }}
            clickable={false}
            click={() => {}}
          />
        </Grid>
        <Grid className={classes.columnCentered}>
          <Typography variant="caption">Start</Typography>
          <Tile
            tile={{ value: TileEnum.START, isPath: false }}
            clickable={false}
            click={() => {}}
          />
        </Grid>
        <Grid className={classes.columnCentered}>
          <Typography variant="caption">End</Typography>
          <Tile
            tile={{ value: TileEnum.END, isPath: false }}
            clickable={false}
            click={() => {}}
          />
        </Grid>

        <Grid className={classes.columnCentered}>
          <Typography variant="caption">Grass</Typography>
          <Tile
            tile={{ value: TileEnum.GRASS, isPath: false }}
            clickable={false}
            click={() => {}}
          />
        </Grid>
      </Grid>
    </Grid>
  );
});
