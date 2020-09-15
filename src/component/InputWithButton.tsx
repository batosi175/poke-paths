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
}

const handleSubmit = (setGridSize: Function, input: number) => {
  setGridSize(input);
};

const useStyles = makeStyles(() =>
  createStyles({
    outerGrid: {
      paddingLeft: "5px",
    },
    input: {
      marginBottom: "5px",
      flex: "1 1 auto",
      justifyContent: "space-between",
      marginRight: "5px",
    },
    textbox: {
      flexGrow: 2,
    },
  })
);

export const InputWithButton = ({ setGridSize }: inputProps) => {
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
        onClick={() => handleSubmit(setGridSize, input)}
      >
        Set Size
      </Button>
    </Grid>
  );
};
