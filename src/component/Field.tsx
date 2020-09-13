import React, { memo } from "react";
import Tile from "./Tile";
import { useCountRenders } from "../hooks/useCountRenders";
import { TileEnum } from "./App";

interface InputProps {
  grid: TileEnum[][];
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
  // useCountRenders("Field");
  return (
    <div className="wrapper">
      <div style={fieldStyle} className="field">
        {grid.map((row: TileEnum[], xPos) => {
          return (
            <div style={rowStyle} className="row" key={xPos}>
              {row.map((col: TileEnum, yPos) => {
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
