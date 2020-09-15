import React from "react";
import {
  Snackbar,
  Button,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

interface inputProps {
  errors: string[];
  clearErrors: Function;
}

const useStyles = makeStyles((theme: Theme) =>
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

export const ErrorBanner = React.memo(({ errors, clearErrors }: inputProps) => {
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
