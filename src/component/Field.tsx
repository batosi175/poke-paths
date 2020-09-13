import React, { memo } from "react";
import Tile from "./Tile";
import { useCountRenders } from "../hooks/useCountRenders";
import { TileProps } from "./App";

interface InputProps {
  grid: TileProps[][];
  // gridSize: number;
  click: Function;
}

const fieldStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  alignItems: "center",
};

const rowStyle = {
  display: "flex",
};

const Field = memo(({ grid, click }: InputProps) => {
  useCountRenders("Field");
  return (
    <div className="wrapper">
      {/* <div className="header">
        Field Size: {gridSize}x{gridSize}
      </div> */}
      <div style={fieldStyle} className="field">
        {grid.map((row: TileProps[], xPos) => {
          return (
            <div style={rowStyle} className="row" key={xPos}>
              {row.map((col: TileProps, yPos) => {
                return (
                  <Tile
                    tile={col}
                    key={[xPos, "-", yPos].join()}
                    click={() => click(xPos, yPos)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Field;
