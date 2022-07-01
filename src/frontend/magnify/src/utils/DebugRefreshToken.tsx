import React, { useState } from 'react';
import { CheckBox, Text } from 'grommet';
import { LogController } from '../controller';

export default function DebugRefreshToken({ controller }: { controller: LogController }) {
  const [checked, setChecked] = useState(localStorage.getItem('debugRefreshToken') === 'true');

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    controller.refreshActivated = event.target.checked;
    localStorage.setItem('debugRefreshToken', event.target.checked ? 'true' : 'false');
  };

  return (
    <>
      <CheckBox
        checked={checked}
        label={<Text>Activate successful refreshToken (act as a connected user)</Text>}
        onChange={handleCheck}
      />
    </>
  );
}
