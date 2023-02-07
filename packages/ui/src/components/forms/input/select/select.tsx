/* eslint-disable react/display-name */
import * as React from 'react';
import { Field, FieldProps } from '../field';
import cn from 'classnames';
import { useFormikContext } from 'formik';

export interface Option {
  label?: string;
  value: string;
}

interface SelectBase extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  isRequired?: boolean;
}

export type SelectProps = SelectBase & Omit<FieldProps, 'type'>;

const SelectComponent = React.forwardRef<HTMLSelectElement, SelectBase>(
  ({ options, placeholder, isRequired, ...props }, ref) => (
    <select
      {...props}
      defaultValue={!isRequired ? '' : options[0].value}
      ref={ref}
    >
      {placeholder && !isRequired && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(({ label, value }, i) => (
        <option key={`value-${i}`} value={value}>
          {label ?? value}
        </option>
      ))}
    </select>
  ),
);

export const Select: React.FC<SelectProps> = ({
  classNames,
  name,
  required,
  ...selectProps
}) => {
  const { setFieldValue, values } = useFormikContext();
  const styles = React.useMemo(() => {
    return cn([
      `form-select block w-full text-ellipsis mr-4 appearance-none rounded border border-solid border-gray-300 bg-white bg-clip-padding bg-no-repeat px-4 py-2 text-xl font-normal transition ease-in-out focus:border-primary-600 focus:outline-none`,
      {
        'text-gray-400': !required && !(values as Record<string, any>)[name],
        'text-gray-700': required || (values as Record<string, any>)[name],
      },
      classNames,
    ]);
  }, [classNames, name, required, values]);

  return (
    <Field
      className={styles}
      component={SelectComponent}
      name={name}
      isRequired={required}
      onChange={(evt: any) => {
        setFieldValue(name, evt.target.value, true);
      }}
      {...selectProps}
    />
  );
};
