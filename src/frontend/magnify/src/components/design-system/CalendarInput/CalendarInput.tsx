import { useIntl } from 'react-intl';
import React from 'react';
import { DateInput, Text } from 'grommet';
import { CalEventSVG } from '../svg-icons';
import { MarginType } from 'grommet/utils';
import Fieldset from '../Fieldset';

export interface CalendarInputProps {
  label: string;
  margin?: MarginType;
  name: string;
  onChange: (e: { value: string | string[] }) => void;
  value: [string, string];
}

const CalendarInput = ({ margin, label, name, value, onChange }: CalendarInputProps) => {
  const intl = useIntl();

  return (
    <Fieldset label={label} name={name} margin={margin}>
      <DateInput value={value} onChange={onChange} icon={<CalEventSVG color="brand" />} />
      <Text color="brand" margin={{ vertical: 'auto' }}>
        {intl.formatDate(new Date(value?.[0]))} - {intl.formatDate(new Date(value?.[1]))}
      </Text>
    </Fieldset>
  );
};

export default CalendarInput;
