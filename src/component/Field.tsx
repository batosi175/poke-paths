import React, { useState, useEffect } from "react";
import Tile from "./Tile";

interface InputProps {
  gridSize: number;
}

export enum TileProps {
  "GRASS",
  "OBSTACLE",
  "START",
  "END",
}

const initalState = (size: number): TileProps[][] => {
  const state = Array(size).fill(Array(size).fill(TileProps.GRASS));
  return state;
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  alignItems: "center",
};

const rowStyle = {
  display: "flex",
};

export interface PropsFunction {
  setGrid: () => void;
}

const Field = ({ gridSize }: InputProps) => {
  // initial state
  const [grid, setGrid] = useState<TileProps[][]>(() => initalState(gridSize));

  // udpating when we get new props
  useEffect(() => {
    setGrid(Array(gridSize).fill(Array(gridSize).fill(TileProps.GRASS)));
  }, [gridSize]);

  const handleTileClick = (xPosition: number, yPosition: number) => {
    const gridCopy: TileProps[][] = JSON.parse(JSON.stringify(grid));
    const enumLength: number = Object.keys(TileProps).length / 2;
    gridCopy[xPosition][yPosition] =
      (gridCopy[xPosition][yPosition] + 1) % enumLength;
    setGrid(gridCopy);
  };
  return (
    <div className="wrapper">
      <div className="header">
        Field Size: {gridSize}x{gridSize}
      </div>
      <div style={fieldStyle} className="field">
        {grid.map((row: TileProps[], xPos) => {
          return (
            <div style={rowStyle} className="row" key={xPos}>
              {row.map((col: TileProps, yPos) => {
                return (
                  <Tile
                    tile={col}
                    key={[xPos, "-", yPos].join()}
                    click={() => handleTileClick(xPos, yPos)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Field;
