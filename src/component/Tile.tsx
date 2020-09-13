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
    <div style={{ padding: "5px" }} className="tile" onClick={() => click()}>
      <img src={getImage(tile.value)} alt="" />
    </div>
  );
});

export default Tile;
