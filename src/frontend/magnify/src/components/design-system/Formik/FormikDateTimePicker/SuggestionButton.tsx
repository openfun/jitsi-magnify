import { Box, Button, Text } from 'grommet';
import { normalizeColor } from 'grommet/utils';
import { DateTime } from 'luxon';
import React, { FunctionComponent, ReactElement } from 'react';
import { useTheme } from 'styled-components';
import { mergeDateTime } from './utils';

const today = DateTime.now().toISO();

export interface suggestionButtonProps {
  buttonValue: string;
  frenchButtonValue: string;
  choiceValue: string;
  onClick: (value: string) => void;
  isToday: boolean;
  beforeToday: boolean;
}

const SuggestionButton: FunctionComponent<suggestionButtonProps> = ({ ...props }): ReactElement => {
  const isChosenButton: boolean = props.frenchButtonValue == props.choiceValue;
  const chosenDateTime = mergeDateTime(today, props.frenchButtonValue);
  const isButtonBeforeNow: boolean = chosenDateTime ? chosenDateTime < today : false;
  const theme = useTheme();
  return (
    <Button
      color={isChosenButton ? `${normalizeColor('light-2', theme)}` : 'black'}
      disabled={props.beforeToday || (props.isToday && isButtonBeforeNow)}
      fill={isChosenButton ? 'horizontal' : false}
      justify="center"
      margin={{ top: 'xsmall' }}
      primary={isChosenButton}
      onClick={() => {
        props.onClick(props.frenchButtonValue);
        console.log(`chosenDateTime : ${chosenDateTime}`);
      }}
    >
      <Box alignContent="center" alignSelf="center">
        <Text color="black" textAlign="center">
          {props.buttonValue}
        </Text>
      </Box>
    </Button>
  );
};

export default SuggestionButton;
