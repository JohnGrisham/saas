import * as React from 'react';
import * as Yup from 'yup';
import {
  ErrorMessage,
  Field as FormikField,
  FieldValidator,
  FieldAttributes,
  useField,
} from 'formik';
import cn from 'classnames';

export type FieldProps = Omit<
  FieldAttributes<React.HTMLAttributes<HTMLInputElement>>,
  'type'
> & {
  classNames?: string;
  label?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
};

export const Field: React.FC<FieldProps> = ({
  classNames,
  disabled = false,
  label,
  name,
  required,
  type = 'text',
  validate,
  ...inputProps
}) => {
  const validateType: FieldValidator = React.useCallback(
    async (value: any) => {
      let error: string | undefined = undefined;

      if (!value && required) {
        return `${name} is required`;
      }

      switch (type) {
        case 'text': {
          const valid = await Yup.string().isValid(value);

          if (value && !valid) {
            error = 'Value must be text';
          }
          break;
        }

        case 'number': {
          const valid = await Yup.number().isValid(value);

          if (value && !valid) {
            error = 'Value must be a number';
          }
          break;
        }

        case 'email': {
          const valid = await Yup.string().email().isValid(value);

          if (value && !valid) {
            error = 'Invalid email address';
          }
          break;
        }

        case 'date': {
          const valid = await Yup.date().isValid(value);

          if (value && !valid) {
            error = 'Value must be a date';
          }
          break;
        }
      }

      return error;
    },
    [name, required, type],
  );
  const [_field, meta] = useField({
    disabled,
    name,
    type,
    validate: validate ?? validateType,
  });
  const styles = React.useMemo(() => {
    return cn([
      `block w-full px-4 py-2 m-0 text-xl font-normal transition ease-in-out bg-white border border-solid rounded form-control bg-clip-padding focus:bg-white focus:outline-none`,
      {
        'border-danger-500 text-danger-500': meta.touched && meta.error,
        'border-gray-300 focus:border-primary-600 focus:text-gray-700':
          meta.touched && !meta.error,
      },
      classNames,
    ]);
  }, [classNames, meta]);

  return (
    <div
      aria-required={required}
      aria-disabled={disabled}
      className={`relative flex justify-center ${
        disabled ? 'cursor-not-allowed opacity-60' : ''
      }`}
    >
      <div className="w-full mb-6 field-wrapper">
        {label && (
          <label
            className={`block pt-2 pb-1 text-sm font-bold ${
              meta.touched && meta.error
                ? 'text-danger-500'
                : 'text-gray-700 dark:text-white'
            }`}
            htmlFor={label}
          >
            {label}
          </label>
        )}
        <FormikField
          className={styles}
          disabled={disabled}
          id={label}
          name={name}
          type={type}
          {...inputProps}
        />
        <ErrorMessage
          component="a"
          className="absolute text-sm text-red-500"
          name={name}
        />
      </div>
    </div>
  );
};
