import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  makeStyles,
  createStyles,
} from "@material-ui/core";

interface inputProps {
  setGridSize: Function;
  clearGrid: Function;
  findPath: Function;
}

const useStyles = makeStyles(() =>
  createStyles({
    outerGrid: {
      paddingLeft: "5px",
    },
    input: {
      marginBottom: "5px",
      flex: "1 1 auto",
      marginRight: "5px",
    },
    textbox: {
      flexGrow: 2,
    },
    submit: {
      flex: "1  1 100%",
    },
  })
);

export const InputWithButtons = ({
  setGridSize,
  clearGrid,
  findPath,
}: inputProps) => {
  const classes = useStyles();
  const [input, setInput] = useState(3);

  const handleSetInput = (inputValue: string) => {
    const parsedValue: number = parseInt(inputValue);
    setInput(parsedValue);
  };

  return (
    <Grid container justify="center" className={classes.outerGrid}>
      <TextField
        className={[classes.input, classes.textbox].join(" ")}
        variant="outlined"
        color="primary"
        type="number"
        label="Select Size"
        name="grid size input"
        value={input}
        size="small"
        onChange={(e) => handleSetInput(e.target.value)}
      />
      <Button
        className={classes.input}
        variant="outlined"
        color="primary"
        onClick={() => setGridSize(input)}
      >
        Set Size
      </Button>
      <Button
        className={classes.input}
        variant="outlined"
        color="primary"
        onClick={() => clearGrid()}
      >
        Clear Grid
      </Button>
      <Button
        className={[classes.input, classes.submit].join(" ")}
        variant="outlined"
        color="primary"
        onClick={() => findPath()}
      >
        Find Path
      </Button>
    </Grid>
  );
};
