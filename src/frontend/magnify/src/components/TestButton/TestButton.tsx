import { Button } from 'grommet';
import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';
import { useController } from '../../controller';

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
  const controller = useController();
  const [examples, setExamples] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    controller.getExamples().then((examples) => {
      setExamples(examples);
    });
  }, []);

  const handleClick = () => {
    controller.sendTest('Test Button clicked');
  };

  return (
    <>
      <VariantButton
        label={intl.formatMessage(messages.testButtonLabel)}
        variant={variant}
        onClick={handleClick}
      />
      <pre data-testid="fetched-examples">{JSON.stringify(examples, null, '  ')}</pre>
    </>
  );
};

export default TestButton;
