import React from "react";
import { Snackbar, Button, makeStyles, createStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

interface InputProps {
  errors: string[];
  clearErrors: Function;
}

const useStyles = makeStyles(() =>
  createStyles({
    snackBar: {
      backgroundColor: "#fff",
    },
    alertTitle: {
      textAlign: "left",
    },
    alertContent: {
      textAlign: "left",
    },
  })
);

// this component will stay hidden if there are no errors supplied.
// we use material ui's snackbar with an alert within it to get an error alert banner
// errors object ex: ["error1", "errro2"]
// if we click the "clear button" use use the clearErrors prop and flush out the array
export const ErrorBanner = React.memo(({ errors, clearErrors }: InputProps) => {
  const classes = useStyles();
  const errorList = errors.map((error, index) => {
    return (
      <li className={classes.alertContent} key={index}>
        {error}
      </li>
    );
  });
  return (
    <Snackbar
      open={errors.length > 0}
      className={classes.snackBar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        variant="outlined"
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => clearErrors()}>
            Clear
          </Button>
        }
      >
        <AlertTitle className={classes.alertTitle}>Error</AlertTitle>
        {errorList}
      </Alert>
    </Snackbar>
  );
});
