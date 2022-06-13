import React from "react";
import { Button } from "grommet";
import styled from "styled-components";

export enum TestButtonVariant {
  BLUE = "blue",
  RED = "red",
}

export interface TestButtonProps {
  variant: TestButtonVariant;
}

const VariantButton = styled(Button)<TestButtonProps>`
  background-color: ${(props) => props.variant};
  color: white;
`;

export default function TestButton({ variant }: TestButtonProps) {
  return <VariantButton label="Test Button" variant={variant} />;
}
