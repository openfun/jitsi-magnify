import { useFormikContext } from 'formik';
import { Box, Button, ButtonExtendedProps, Spinner, Tip } from 'grommet';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Maybe } from '../../../../types/misc';

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

interface FormikSubmitButtonProps extends ButtonExtendedProps {
  overrideSubmit?: (values: unknown) => void;
}

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
            <Button {...props} primary disabled={true} />
          </Box>
        </Tip>
      )}
      {canSubmit && (
        <Button
          {...props}
          primary
          disabled={formik.isSubmitting}
          icon={formik.isSubmitting ? <Spinner size={'xsmall'} /> : undefined}
          onClick={onSubmit}
        />
      )}
    </Box>
  );
};
