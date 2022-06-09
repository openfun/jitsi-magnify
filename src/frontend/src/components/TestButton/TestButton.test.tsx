import React from "react";
import TestButton from "./TestButton";
import { render } from "@testing-library/react";

describe("TestButton", () => {
  it("renders correctly", () => {
    const { findByText } = render(<TestButton />);
    expect(findByText("Test")).toBeTruthy();
  });
});
