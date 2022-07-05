import React from 'react';
import { Card } from 'grommet';
import styled, { keyframes } from 'styled-components';

export interface WaitingRowProps {
  /**
   * The background color of the card
   */
  background?: string;
  /**
   * The min height of the card
   */
  minHeight?: string;
}

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

const WaitingRow = ({ background, minHeight }: WaitingRowProps) => {
  return (
    <BlinkingCard
      elevation="0"
      background={background || 'light-2'}
      height={{ min: minHeight || '40px' }}
      margin={{ bottom: 'small' }}
      pad="small"
      title="Loading rooms..."
    />
  );
};

export default WaitingRow;
