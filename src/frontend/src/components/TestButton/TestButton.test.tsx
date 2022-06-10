import React from "react";
import TestButton, { TestButtonVariant } from "./TestButton";
import { render, screen } from "@testing-library/react";

describe("TestButton", () => {
  it("renders the test button in red when variant is red", () => {
    render(<TestButton variant={TestButtonVariant.RED} />);
    const testButton = screen.getByRole("button", { name: "Test Button" });
    expect(testButton).toHaveStyle({ backgroundColor: "red" });
  });
  
  it("renders the test button in blue when variant is blue", () => {
    render(<TestButton variant={TestButtonVariant.BLUE} />);
    const testButton = screen.getByRole("button", { name: "Test Button" });
    expect(testButton).toHaveStyle({ backgroundColor: "blue" });
  });
});
