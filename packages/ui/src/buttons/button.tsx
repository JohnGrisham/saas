import * as React from 'react';
import cn from 'classnames';
export interface ButtonProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'danger' | 'warning' | 'info';
  classNames?: string;
  disabled?: boolean;
  link?: string;
  outline?: boolean;
  rounded?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  classNames,
  color = 'primary',
  disabled = false,
  link = '',
  outline = false,
  rounded = false,
  size = 'medium',
}) => {
  const styles = React.useMemo(() => {
    return cn([
      `inline-block rounded font-medium uppercase transition duration-150 ease-in-out`,
      {
        'text-xs leading-tight': size !== 'large',
        'px-2.5 py-1.5': size === 'small',
        'px-3.5 py-2.5': size === 'medium',
        'px-7 py-3 text-sm leading-snug': size === 'large',
        'pointer-events-none text-decoration-none select-none': disabled,
        'text-white': !link && !outline,
        'rounded-full': rounded && !link,
        'shadow-md': !link,
        [`cursor-pointer hover:text-${color}-600 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-0 active:bg-gray-200`]:
          link && !disabled,
        [`border-${color}-500 border-2`]: outline && !link,
        [`hover:text-${color}-400 focus:text-${color}-400 active:text-${color}-400 hover:bg-opacity-5`]:
          outline && !link && !disabled,
        [`bg-${color}-500`]: !outline && !link,
        [`text-${color}-500`]: outline || link,
        [`hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg dark:hover:text-${color}-700 dark:focus:text-${color}-700 dark:active:text-${color}-700 hover:bg-${color}-600 dark:hover:bg-${color}-400 focus:bg-${color}-700 dark:focus:bg-${color}-300 active:bg-${color}-800 dark:active:bg-${color}-200`]:
          !link && !disabled,
      },
      classNames,
    ]);
  }, [classNames, color, disabled, link, outline, rounded, size]);

  return (
    <div
      className={`flex justify-center items-center space-x-2 ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      aria-disabled={disabled}
    >
      {link ? (
        <a className={styles} href={disabled ? undefined : link}>
          {children}
        </a>
      ) : (
        <button type="button" className={styles} disabled={disabled}>
          {children}
        </button>
      )}
    </div>
  );
};
