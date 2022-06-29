import { IntlShape } from 'react-intl';
import { validationMessages } from '../i18n/Messages';
import validator from 'validator';

export type Validator<T> = (intl: IntlShape) => (value: string, others: T) => string[];

/**
 * Utility to aggregate multiple validators into one.
 *
 * Example of use:
 *
 * const v = validators(intl, requiredValidator, minLengthValidator(3));
 */
export default function validators<T>(intl: IntlShape, ...validators: Validator<T>[]) {
  return (value: string, others: T) => {
    const errors = validators.reduce(
      (acc, validator) => [...acc, ...validator(intl)(value, others)],
      [] as string[],
    );
    return errors.length > 0 ? errors : [];
  };
}

/**
 * Validator to verify that a string value is provided and not empty
 */
export function requiredValidator(intl: IntlShape) {
  return (value: string) => {
    if (!value || value.length < 1) return [intl.formatMessage(validationMessages.required)];
    return [];
  };
}

/**
 * Validator to verify that a string value can be used as a username
 */
export function usernameValidator(intl: IntlShape) {
  return (value: string) => {
    if (value && value.length >=1 && !validator.matches(value, /^[a-zA-Z0-9_]{3,16}$/))
      return [intl.formatMessage(validationMessages.usernameInvalid)];
    return [];
  };
}

/**
 * Validator to verify that a string value can be used as an email
 */
export function emailValidator(intl: IntlShape) {
  return (value: string) => {
    if (value && value.length >=1 && !validator.isEmail(value)) return [intl.formatMessage(validationMessages.emailInvalid)];
    return [];
  };
}

/**
 * Validator to verify password and confirm password matches
 */
export function passwordConfirmValidator(intl: IntlShape) {
  return (value: string, others: { password: string }) => {
    if (value && value.length >=1 && value !== others.password)
      return [intl.formatMessage(validationMessages.confirmDoesNotMatch)];
    return [];
  };
}
