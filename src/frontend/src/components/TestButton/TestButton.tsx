import React, { ReactElement } from "react";
import classes from "./styles.module.css";

export default function TestButton(): ReactElement {
  return <button className={classes.root}>Test</button>;
}
