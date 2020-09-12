import React, { useState, useEffect } from "react";
import Tile from "./Tile";

interface InputProps {
  gridSize: number;
}

export interface TileProps {
  value: "GRASS" | "START" | "END" | "OBSTACLE";
}

const Field = ({ gridSize }: InputProps) => {
  // initial state
  const [grid, setGrid] = useState(Array(Math.pow(gridSize, 2)).fill("GRASS"));
  // udpating when we get new props
  useEffect(() => {
    setGrid(Array(Math.pow(gridSize, 2)).fill("GRASS"));
  }, [gridSize]);

  return (
    <div className="wrapper">
      <div className="header">
        Field Size: {gridSize}x{gridSize}
      </div>
      {grid.map((tile: TileProps, index) => (
        <Tile tile={tile} key={index} />
      ))}
    </div>
  );
};

export default Field;
