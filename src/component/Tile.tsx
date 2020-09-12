import React from "react";
import { TileProps } from "./Field";

interface InputProps {
  tile: TileProps;
}

const Tile = ({ tile }: InputProps) => {
  return <div className="tile">{tile}</div>;
};

export default Tile;
