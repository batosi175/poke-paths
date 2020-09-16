import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  makeStyles,
  createStyles,
} from "@material-ui/core";

interface InputProps {
  setGridSize: Function;
  clearGrid: Function;
  findPath: Function;
}

interface ButtonProps {
  label: string;
  action: Function;
}

const useStyles = makeStyles(() =>
  createStyles({
    outerGrid: {
      paddingTop: "5px",
    },
    input: {
      marginBottom: "5px",
      flex: "1 1 auto",
    },
  })
);

// this component bubbles up multiple actions.
// It will send up the grid size in the text input whenever we choose to set it (either with the 'set grid' button or by pressing enter)
// It will send an action to clear the grid to all grass tiles
// It will also send an action that will cause us to contact the api and find a path
export const ControlPanel = ({
  setGridSize,
  clearGrid,
  findPath,
}: InputProps) => {
  const classes = useStyles();
  // we type it to either a number or empty string so that we can avoid having errors when the user clears the box or begins to type a negative number
  const [input, setInput] = useState<number | "">(3);

  // transforms the input value and set's it to a number or empty string in the local state
  const handleSetInput = (inputValue: string) => {
    const parsedValue: number = parseInt(inputValue);
    if (isNaN(parsedValue)) {
      setInput("");
    } else {
      setInput(parsedValue);
    }
  };

  // makes the way we interact with buttons consistent so we can pass the actions as props to the mapping function
  const handleSetGridSize = () => {
    setGridSize(input);
  };

  const buttons: ButtonProps[] = [
    { label: "Set Size", action: handleSetGridSize },
    { label: "Clear Grid", action: clearGrid },
    { label: "Find Path", action: findPath },
  ];

  const getButton = (button: ButtonProps) => {
    return (
      <Button
        key={button.label}
        className={classes.input}
        variant="outlined"
        color="primary"
        onClick={() => button.action()}
      >
        {button.label}
      </Button>
    );
  };

  return (
    <Grid container justify="center" className={classes.outerGrid}>
      <TextField
        className={classes.input}
        variant="outlined"
        color="primary"
        type="number"
        label="Select Size"
        name="grid size input"
        value={input}
        size="small"
        onChange={(e) => handleSetInput(e.target.value)}
        onKeyUp={(e) => e.keyCode === 13 && handleSetGridSize()}
      />
      {buttons.map((button) => getButton(button))}
    </Grid>
  );
};
