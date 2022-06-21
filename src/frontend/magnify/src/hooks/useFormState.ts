import { useCallback, useState } from 'react';

type Validators<T> = {
  [key in keyof T]: (value: string, otherValues: T) => string[] | null;
};

interface UseFormState<T> {
  /**
   * The current form state, with values for each field.
   */
  values: T;
  /**
   * The errors on each field
   */
  errors: Record<keyof T, string[]>;
  /**
   * Whether each field is modified
   * It may be used to display errors only when the field is modified, or to
   * optimize the partial update requests
   */
  modified: Record<keyof T, boolean>;
  /**
   * A callback to update a single field
   */
  setValue: (key: keyof T, value: string) => void;
  /**
   * Are they errors ? (if so, the form is invalid)
   */
  isValid: boolean;
  /**
   * Are values diferrent from initial values ? (if so, the form is modified)
   */
  isModified: boolean;
}

/**
 * This hook is used to manage the state of a form.
 * It is used to validate the form, and to update the values.
 *
 * @param initialState The initial state of the form
 * @param validators An object describing the validators for each field
 *      For each field, profide a function returning:
 *          - [] if the field is valid
 *          - ["error message"] if the field as an error
 *          - ["err1", "err2"] if the field as multiple errors
 *      As input, each validator receive the new value of the field, and the values of all other fields.
 * @returns UseFormState
 */
export default function useFormState<T extends Record<string, string>>(
  initialState: T,
  validators: Validators<T>,
): UseFormState<T> {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState(
    Object.fromEntries(Object.keys(initialState).map((key) => [key, [] as string[]])) as Record<
      keyof T,
      string[]
    >,
  );

  const setValue = useCallback((name: keyof T, value: string) => {
    // Reminder: setters are kind of async, so we need to use a callback to update the state,
    // and to access the new value for error validation, the validation must be done
    // inside too
    setValues((pValues: T) => {
      const newValues = { ...pValues, [name]: value };
      const newErrors = Object.fromEntries(
        Object.keys(validators).map((key) => {
          return [key, validators[key as keyof T](newValues[key as keyof T], newValues)];
        }),
      ) as Record<keyof T, string[]>;

      setErrors(newErrors);
      return newValues;
    });
  }, []);

  const modified = Object.fromEntries(
    Object.keys(values).map((key) => [
      key,
      values[key as keyof T] !== initialState[key as keyof T],
    ]),
  ) as Record<keyof T, boolean>;

  return {
    values,
    setValue,
    errors,
    modified,
    isValid: Object.values(errors).every((error) => (error as string[]).length === 0),
    isModified: Object.values(modified).some((modified) => modified),
  };
}
