import React, { memo } from "react";
import { TileProps } from "../model/Models";
import { TileEnum } from "../model/Enums";
import { makeStyles, createStyles } from "@material-ui/core";
const bulbasaur = "bulbasaur.png";
const finishTile = "finishtile.png";
const grassTile = "grasstile.png";
const rockTile = "rocktile.png";

interface InputProps {
  tile: TileProps;
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

const getImage = (tile: TileEnum) => {
  switch (tile) {
    case TileEnum.GRASS:
      return process.env.PUBLIC_URL + grassTile;
    case TileEnum.START:
      return process.env.PUBLIC_URL + bulbasaur;
    case TileEnum.END:
      return process.env.PUBLIC_URL + finishTile;
    case TileEnum.OBSTACLE:
      return process.env.PUBLIC_URL + rockTile;
  }
};

const Tile = memo(({ tile, click, clickable = true }: InputProps) => {
  const classes = useStyles();
  const getClass = (isPath: boolean, isClickable: boolean) => {
    const finalClass = [];
    finalClass.push(classes.tileImage);
    isPath && finalClass.push(classes.active);
    isClickable && finalClass.push(classes.clickable);
    return finalClass.join(" ");
  };
  return (
    <img
      src={getImage(tile.value)}
      alt={TileEnum[tile.value]}
      className={getClass(tile.isPath, clickable)}
      onClick={() => click()}
    />
  );
});

export default Tile;
