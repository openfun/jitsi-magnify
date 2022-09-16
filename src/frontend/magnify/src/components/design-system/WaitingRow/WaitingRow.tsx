import { Card } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled, { keyframes } from 'styled-components';

const messages = defineMessages({
  waitingRowTitle: {
    id: 'components.designSystem.waitingRow.title',
    description: 'Accessibility label for the blinking card when waiting for a list of row',
    defaultMessage: 'Loading...',
  },
});

const blink = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`;

const BlinkingCard = styled(Card)`
  animation: ${blink} 2s linear infinite;
`;

export interface WaitingRowProps {
  /**
   * The background color of the card when at maximum opacity
   * Keep in mind that the opacity will drop to 50% of this color
   * on a 1s linear animation
   */
  background?: string;
  /**
   * The min height of the card, default being 40px
   */
  minHeight?: string;
}

const WaitingRow = ({ background, minHeight }: WaitingRowProps) => {
  const intl = useIntl();
  return (
    <BlinkingCard
      background={background || 'light-2'}
      elevation="0"
      height={{ min: minHeight || '40px' }}
      margin={{ bottom: 'small' }}
      pad="small"
      title={intl.formatMessage(messages.waitingRowTitle)}
    />
  );
};

export default WaitingRow;
