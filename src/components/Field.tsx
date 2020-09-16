import React, { memo } from "react";
import Tile from "./Tile";
import { TileProp } from "../model/Models";
import { makeStyles, createStyles } from "@material-ui/core";

interface InputProps {
  grid: TileProp[][];
  click: Function;
}

const useStyles = makeStyles(() =>
  createStyles({
    fieldStyle: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    rowStyle: {
      display: "flex",
    },
  })
);

// this will take a grid of shape TileProps[][] and a click function from the parent component
// it will bubble up the click that comes from the tile component
// this render's out our tiles in a n x n grid
const Field = memo(({ grid, click }: InputProps) => {
  const classes = useStyles();
  return (
    <div className={classes.fieldStyle}>
      {grid.map((row: TileProp[], xPos) => {
        return (
          <div className={classes.rowStyle} key={xPos}>
            {row.map((col: TileProp, yPos) => {
              return (
                <Tile
                  tile={col}
                  key={[xPos, "-", yPos].join()}
                  click={() => click(xPos, yPos)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
});

export default Field;
