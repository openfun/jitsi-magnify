import { DateInput, Text } from 'grommet';
import { MarginType } from 'grommet/utils';
import React from 'react';
import { useIntl } from 'react-intl';
import Fieldset from '../Fieldset';
import { CalEventSVG } from '../svg-icons';

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
    <Fieldset label={label} margin={margin} name={name}>
      <DateInput icon={<CalEventSVG color="brand" />} onChange={onChange} value={value} />
      <Text color="brand" margin={{ vertical: 'auto' }}>
        {intl.formatDate(new Date(value?.[0]))} - {intl.formatDate(new Date(value?.[1]))}
      </Text>
    </Fieldset>
  );
};

export default CalendarInput;
