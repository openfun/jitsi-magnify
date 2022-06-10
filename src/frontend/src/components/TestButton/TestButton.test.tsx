import React from "react";
import TestButton from "./TestButton";
import { render, screen } from "@testing-library/react";

describe("TestButton", () => {
  it("renders correctly", () => {
    render(<TestButton variant="red" />);
    screen.getByText("Test Button");
  });
});
