import React, { useState } from "react";
import { Button, TextField, Grid } from "@material-ui/core";

interface inputProps {
  setGridSize: Function;
}

const textFieldProps = {
  min: 2,
};

const handleSubmit = (setGridSize: Function, input: number) => {
  setGridSize(input);
};

export const InputWithButton = ({ setGridSize }: inputProps) => {
  const [input, setInput] = useState(3);

  return (
    <Grid container justify="center">
      <TextField
        variant="outlined"
        color="primary"
        type="number"
        label="Select Grid Size"
        name="grid size input"
        value={input}
        size="small"
        inputProps={textFieldProps}
        onChange={(e) => setInput(parseInt(e.target.value))}
      />
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleSubmit(setGridSize, input)}
      >
        Set Size
      </Button>
    </Grid>
  );
};
