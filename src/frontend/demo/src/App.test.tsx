import React from "react";
import { IntlProvider } from 'react-intl';
import App from "./App";
import { render, screen } from "@testing-library/react";

describe("App", () => {
  it("renders the test button", () => {
    render(
      <IntlProvider locale="en">
        <App />
      </IntlProvider>
    );
    screen.getByRole("button", { name: "Test Button" });
  });

});
