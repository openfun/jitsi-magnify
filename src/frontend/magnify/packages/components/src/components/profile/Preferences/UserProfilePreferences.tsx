import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import { Box } from 'grommet';
import * as React from 'react';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { useAuthContext } from '../../../context';
import { useLocale } from '../../../i18n';
import { UsersRepository } from '../../../services';
import { MagnifyLocales } from '../../../utils';
import { getDefaultLocale } from '../../../utils/settings';
import { LocalizedForm } from '../../design-system/Formik/LanguageChange';
import { FormikSelectLanguage } from '../../design-system/Formik/Select/Language';
import { FormikValuesChange } from '../../design-system/Formik/ValuesChange/FormikValuesChange';

interface PreferenceFormValues {
  language: string;
}

export const UserProfilePreferences = () => {
  const authContext = useAuthContext();
  const locales = useLocale();

  const validationSchema = Yup.object().shape({
    language: Yup.string().required(),
  });

  const { mutate: updateUser } = useMutation(
    async (data: PreferenceFormValues) => {
      if (authContext.user?.id == null) {
        return;
      }

      return await UsersRepository.update(authContext.user.id, data);
    },
    {
      retry: 0,
      onSuccess: (user) => {
        authContext.updateUser(user);
      },
    },
  );

  const handleSubmit = (values: PreferenceFormValues) => {
    updateUser(values);
  };

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      initialValues={{
        language: authContext.user?.language ?? getDefaultLocale(),
      }}
    >
      <FormikValuesChange debounceTime={200}>
        <LocalizedForm>
          <Box gap="10px">
            <FormikSelectLanguage
              changeCallback={(locale) => {
                locales.setCurrentLocale(locale);
              }}
            />
          </Box>
        </LocalizedForm>
      </FormikValuesChange>
    </Formik>
  );
};
