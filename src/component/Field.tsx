import React from "react";
import Tile from "./Tile";

const Field = () => {
  const grid: Array<number> = Array(9).fill(null);
  return (
    <div className="wrapper">
      <div className="header">Field</div>
      {grid.map((tile) => (
        <Tile />
      ))}
    </div>
  );
};

export default Field;
