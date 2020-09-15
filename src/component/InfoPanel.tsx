import React from "react";
import { Grid, makeStyles, createStyles, Typography } from "@material-ui/core";
import Tile from "./Tile";
import { TileEnum } from "../model/Enums";
import { TileProp } from "../model/Models";

const style = createStyles({
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
});

const useStyles = makeStyles(style);

interface TileLegend {
  tile: TileProp;
  label: string;
}

// easier to have a set of properties here since we just repeat the legend items
const lengendTiles: TileLegend[] = [
  { tile: { value: TileEnum.OBSTACLE, isPath: false }, label: "Obstacle" },
  { tile: { value: TileEnum.START, isPath: false }, label: "Start" },
  { tile: { value: TileEnum.END, isPath: false }, label: "End" },
  { tile: { value: TileEnum.GRASS, isPath: false }, label: "Grass" },
];

const instructionContent = [
  "Click on a tile to toggle It's type between Obstacle, Start, End and Grass.",
  "You can change the size by using the input and selecting 'Set Size'.",
  "'Clear Grid' will set all tiles to grass on the current grid.",
  "'Find path' will highlight a route from start to end, avoiding obstacles.",
];
// this is not making use of makeStyles, so i can keep it outside the component
const getInstructionContent = (instructionContent: string, index: number) => {
  return (
    <Typography variant="body1" align="center" key={"text" + index}>
      {instructionContent}
    </Typography>
  );
};
// This component provides some useful information to the user
// it contains the instructions for interaction and a legend of the different tile types
// we also display the legend in the order that they are cycled through
export const InfoPanel = React.memo(() => {
  const classes = useStyles();

  // since we are returning a bunch of the same data type i'm just mapping through a set of properties instead.
  // it's inside the component since i'm using makeStyles
  const getlegendItem = (tileLegend: TileLegend) => {
    return (
      <Grid className={classes.columnCentered} key={tileLegend.label}>
        <Typography variant="caption">{tileLegend.label}</Typography>
        <Tile tile={tileLegend.tile} clickable={false} click={() => {}} />
      </Grid>
    );
  };

  return (
    <Grid container direction="column">
      <Typography variant="h5" align="center" gutterBottom>
        Instructions
      </Typography>
      <Grid container className={classes.columnCentered}>
        {instructionContent.flatMap((instruction, index) => [
          getInstructionContent(instruction, index),
          <div className={classes.line} key={index} />,
        ])}
      </Grid>
      <Grid container justify="center">
        <Typography variant="h5" gutterBottom>
          Legend
        </Typography>
      </Grid>
      <Grid container className={classes.legendRow}>
        {lengendTiles.map((legendTile) => getlegendItem(legendTile))}
      </Grid>
    </Grid>
  );
});
