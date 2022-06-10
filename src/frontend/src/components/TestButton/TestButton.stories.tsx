import React from "react";
import TestButton from "./TestButton";

export default {
  title: "TestButton",
  component: TestButton,
};

// create the template and 2 stories for variants blue and red
export const Blue = () => <TestButton variant="blue" />;
export const Red = () => <TestButton variant="red" />;
