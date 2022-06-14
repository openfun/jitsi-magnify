import React from "react";
import TestButton, { TestButtonVariant } from "./TestButton";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
  title: "TestButton",
  component: TestButton,
} as ComponentMeta<typeof TestButton>;

const Template: ComponentStory<typeof TestButton> = (args) => (
  <TestButton {...args} />
);

// create the template and 2 stories for variants blue and red
export const BlueButton = Template.bind({});
BlueButton.args = {
  variant: TestButtonVariant.BLUE,
};

export const RedButton = Template.bind({});
RedButton.args = {
  variant: TestButtonVariant.RED,
};
