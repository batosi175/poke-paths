import React, { memo } from "react";
import { TileProps } from "./App";
const bulbasaur = "bulbasaur.png";
const finishTile = "finishtile.png";
const grassTile = "grasstile.png";
const rockTile = "rocktile.png";

interface InputProps {
  tile: TileProps;
  click: Function;
}

const getImage = (tile: TileProps) => {
  switch (tile) {
    case TileProps.GRASS:
      return process.env.PUBLIC_URL + grassTile;
    case TileProps.START:
      return process.env.PUBLIC_URL + bulbasaur;
    case TileProps.END:
      return process.env.PUBLIC_URL + finishTile;
    case TileProps.OBSTACLE:
      return process.env.PUBLIC_URL + rockTile;
  }
};

const Tile = memo(({ tile, click }: InputProps) => {
  return (
    <div style={{ padding: "5px" }} className="tile" onClick={() => click()}>
      <img src={getImage(tile)} alt="" />
    </div>
  );
});

export default Tile;
