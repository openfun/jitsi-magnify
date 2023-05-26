import { Button } from '@openfun/cunningham-react';
import { useFormikContext } from 'formik';
import { Box, Spinner, Tip } from 'grommet';
import { FunctionComponent } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Maybe } from '../../../../types/misc';
import { LoadingButton } from '../../Button/Loading';

export const formikSubmitButtonMessages = defineMessages({
  isNotDirty: {
    id: 'components.designSystem.formik.formikSubmitButton.isNotDirty',
    description: 'Messages shown on hover when form is not dirty ',
    defaultMessage: 'No changes detected',
  },
  formIsInvalid: {
    id: 'components.designSystem.formik.formikSubmitButton.formIsInvalid',
    description: 'Messages shown on hover when form is invalid ',
    defaultMessage: 'Invalid form',
  },
});

type FormikSubmitButtonProps = Parameters<typeof Button>[0] & {
  label: string;
  overrideSubmit?: (values: unknown) => void;
  isLoading?: boolean;
};

export const FormikSubmitButton: FunctionComponent<FormikSubmitButtonProps> = ({ ...props }) => {
  const formik = useFormikContext();
  const intl = useIntl();
  const canSubmit = formik.dirty && formik.isValid;
  const showTooltipMessage = !formik.dirty || !formik.isValid;

  const onSubmit = (): void => {
    if (props.overrideSubmit != null) {
      props.overrideSubmit(formik.values);
    } else {
      formik.handleSubmit();
    }

    /**
     * To simulate end of request.
     * Move the logic back to the parent component once the connection to the backend is established
     * (in the onSubmit of the Formik form)
     */
    setTimeout(() => {
      formik.setSubmitting(false);
    }, 1000);
  };

  const getTooltipMessage = (): Maybe<string> => {
    if (!formik.dirty) {
      return intl.formatMessage(formikSubmitButtonMessages.isNotDirty);
    } else if (!formik.isValid) {
      return intl.formatMessage(formikSubmitButtonMessages.formIsInvalid);
    }
  };

  return (
    <Box direction="row" justify="end" margin={{ top: 'small' }}>
      {showTooltipMessage && (
        <Tip content={getTooltipMessage()}>
          <Box>
            <Button {...props} disabled={true}>
              {props.label}
            </Button>
          </Box>
        </Tip>
      )}
      {canSubmit && (
        <LoadingButton
          {...props}
          color="primary"
          disabled={formik.isSubmitting || props.isLoading}
          icon={formik.isSubmitting || props.isLoading ? <Spinner size={'xsmall'} /> : undefined}
          onClick={onSubmit}
        >
          {props.label}
        </LoadingButton>
      )}
    </Box>
  );
};
