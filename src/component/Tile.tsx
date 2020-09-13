import React, { memo } from "react";
import { TileEnum, TileProps } from "./App";
const bulbasaur = "bulbasaur.png";
const finishTile = "finishtile.png";
const grassTile = "grasstile.png";
const rockTile = "rocktile.png";

interface InputProps {
  tile: TileProps;
  click: Function;
}

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

const Tile = memo(({ tile, click }: InputProps) => {
  return (
    <img
      src={getImage(tile.value)}
      alt={TileEnum[tile.value]}
      style={{
        border: tile.isPath ? "solid 5px yellow" : "solid 5px black",
        backgroundColor: TileEnum[tile.value] === "START" ? "green" : "",
      }}
      className="tile"
      onClick={() => click()}
    />
  );
});

export default Tile;
