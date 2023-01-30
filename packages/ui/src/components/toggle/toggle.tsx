import * as React from 'react';
import cn from 'classnames';

export interface ToggleProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'role' | 'size'
  > {
  children?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'danger' | 'warning' | 'info';
  classNames?: string;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Toggle: React.FC<ToggleProps> = ({
  children,
  classNames,
  color = 'primary',
  disabled = false,
  label,
  size = 'medium',
  ...inputProps
}) => {
  const styles = React.useMemo(() => {
    return cn([
      `h-5 -ml-10 align-top bg-white bg-gray-300 bg-no-repeat bg-contain rounded-full shadow-sm appearance-none cursor-pointer form-check-input w-9 focus:outline-none checked:bg-${color}-600 toggle`,
      {
        'px-2.5 py-1.5': size === 'small',
        'px-5 py-3': size === 'medium',
        'px-7 py-3': size === 'large',
        'pointer-events-none text-decoration-none select-none': disabled,
      },
      classNames,
    ]);
  }, [classNames, color, disabled, size]);

  return (
    <div
      aria-disabled={disabled}
      className={`flex justify-center ${
        disabled ? 'cursor-not-allowed opacity-60' : ''
      }`}
    >
      <div
        className={`form-check form-switch flex items-center ${
          label ? 'pl-10' : undefined
        }`}
      >
        <input
          className={styles}
          disabled={disabled}
          type="checkbox"
          role="switch"
          id={label}
          {...inputProps}
        />
        {label && (
          <label
            className="inline-block ml-2 text-gray-800 form-check-label"
            htmlFor={label}
          >
            {label}
          </label>
        )}
        {children}
      </div>
    </div>
  );
};
