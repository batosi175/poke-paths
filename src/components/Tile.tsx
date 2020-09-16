import React, { memo } from "react";
import { TileProp } from "../model/Models";
import { TileEnum } from "../model/Enums";
import { makeStyles, createStyles } from "@material-ui/core";
const bulbasaur = "bulbasaur.png";
const finishTile = "finishtile.png";
const grassTile = "grasstile.png";
const rockTile = "rocktile.png";

interface InputProps {
  tile: TileProp;
  click: Function;
  clickable?: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    tileImage: {
      backgroundColor: "green",
      border: "solid 5px black",
    },
    active: {
      border: "solid 5px yellow",
    },
    clickable: {
      cursor: "pointer",
    },
  })
);

// map of tile images
const tileMap = {
  [TileEnum.GRASS]: process.env.PUBLIC_URL + grassTile,
  [TileEnum.START]: process.env.PUBLIC_URL + bulbasaur,
  [TileEnum.END]: process.env.PUBLIC_URL + finishTile,
  [TileEnum.OBSTACLE]: process.env.PUBLIC_URL + rockTile,
};

const Tile = memo(({ tile, click, clickable = true }: InputProps) => {
  const classes = useStyles();

  const getClass = (isPath: boolean, isClickable: boolean) => {
    const classList = [];
    classList.push(classes.tileImage);
    isPath && classList.push(classes.active);
    isClickable && classList.push(classes.clickable);
    return classList.join(" ");
  };

  return (
    <img
      src={tileMap[tile.value]}
      alt={TileEnum[tile.value]}
      className={getClass(tile.isPath, clickable)}
      onClick={() => click()}
    />
  );
});

export default Tile;
