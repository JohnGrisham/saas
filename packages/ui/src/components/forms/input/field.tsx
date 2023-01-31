import * as React from 'react';
import { Field as FormikField, FieldAttributes } from 'formik';
import cn from 'classnames';

export type FieldProps = FieldAttributes<
  React.HTMLAttributes<HTMLInputElement>
> & {
  classNames?: string;
  label?: string;
};

export const Field: React.FC<FieldProps> = ({
  classNames,
  disabled = false,
  label,
  name,
  type = 'text',
  ...inputProps
}) => {
  const styles = React.useMemo(() => {
    return cn([
      `block w-full px-4 py-2 m-0 text-xl font-normal text-gray-700 transition ease-in-out bg-white border border-gray-300 border-solid rounded form-control bg-clip-padding focus:border-primary-600 focus:bg-white focus:text-gray-700 focus:outline-none`,
      classNames,
    ]);
  }, [classNames]);

  return (
    <div
      aria-disabled={disabled}
      className={`flex justify-center ${
        disabled ? 'cursor-not-allowed opacity-60' : ''
      }`}
    >
      <div className="w-full mb-4">
        {label && (
          <label
            className="block pt-2 pb-1 text-sm font-bold text-gray-700 dark:text-white"
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
      </div>
    </div>
  );
};
