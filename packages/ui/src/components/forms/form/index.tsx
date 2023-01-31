import * as React from 'react';
import { Formik, FormikConfig, Form as FormikForm } from 'formik';

export interface FormProps<T = any> extends FormikConfig<T> {
  children: React.ReactNode;
  innerFormProps?: React.HTMLAttributes<HTMLFormElement>;
}

export const Form: React.FC<FormProps> = ({
  children,
  innerFormProps,
  ...formikProps
}) => {
  return (
    <Formik {...formikProps}>
      <FormikForm {...innerFormProps}>{children}</FormikForm>
    </Formik>
  );
};
