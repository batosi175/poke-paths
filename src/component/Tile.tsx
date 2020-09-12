import React from "react";
import { TileProps } from "./Field";

interface InputProps {
  tile: TileProps;
  click: Function;
}

const Tile = React.memo(({ tile, click }: InputProps) => {
  return (
    <div style={{ padding: "5px" }} className="tile" onClick={() => click()}>
      {TileProps[tile]}
    </div>
  );
});

export default Tile;
