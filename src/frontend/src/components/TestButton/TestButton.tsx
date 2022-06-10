import React from "react";
import { Button } from "grommet";
import styled from "styled-components";

const RedButton = styled(Button)`
  background-color: red;
  color: white;
`;

const BlueButton = styled(Button)`
  background-color: blue;
  color: white;
`;

export interface TestButtonProps {
  variant: "blue" | "red";
}

export default function TestButton(props: TestButtonProps) {
  const { variant } = props;

  const ButtonComponent = variant === "blue" ? BlueButton : RedButton;

  return <ButtonComponent label="Test Button" />;
}
