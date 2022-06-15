import { defineMessages, useIntl } from 'react-intl';
import React from 'react';
import { Button } from 'grommet';
import styled from 'styled-components';

export enum TestButtonVariant {
  BLUE = 'blue',
  RED = 'red',
}

export interface TestButtonProps {
  variant: TestButtonVariant;
}

const VariantButton = styled(Button)<TestButtonProps>`
  background-color: ${(props) => props.variant};
  color: white;
`;

const messages = defineMessages({
  testButtonLabel: {
    defaultMessage: `Test Button`,
    description: 'Call to action on the test button',
    id: 'components.TestButton.testButtonLabel',
  },
});

const TestButton = ({ variant }: TestButtonProps) => {
  const intl = useIntl();

  return <VariantButton label={intl.formatMessage(messages.testButtonLabel)} variant={variant} />;
};

export default TestButton;
