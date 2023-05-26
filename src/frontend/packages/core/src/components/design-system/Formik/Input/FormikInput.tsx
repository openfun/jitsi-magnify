import { Input } from '@openfun/cunningham-react';
import { useField } from 'formik';
import { Box } from 'grommet';
import { useMemo, useState } from 'react';
import { Maybe } from '../../../../types/misc';

type WrapperInputProps = Parameters<typeof Input>[0] & {
  name: string;
};

export const FormikInput = (props: WrapperInputProps) => {
  const [field, meta] = useField(props.name);
  const [showPassword, setShowPassword] = useState(false);

  const getInputType = (): string => {
    if (props.type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return props.type ?? 'text';
  };

  const inputState = useMemo((): Maybe<'success' | 'error'> => {
    if (!meta.touched || (meta.error === undefined && field.value === '')) {
      return undefined;
    }

    return meta.error === undefined ? 'success' : 'error';
  }, [meta.error, meta.touched]);

  const getRightIcon = (): Maybe<React.ReactElement> => {
    if (props.type === 'password') {
      return (
        <Box
          focusIndicator={false}
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: 'pointer' }}
        >
          <span className="material-icons">{showPassword ? 'visibility' : 'visibility_off'}</span>
        </Box>
      );
    }
    return undefined;
  };

  return (
    <Input
      {...field}
      {...props}
      rightIcon={getRightIcon()}
      state={inputState}
      text={meta.error ?? props.text}
      type={getInputType()}
    />
  );
};
