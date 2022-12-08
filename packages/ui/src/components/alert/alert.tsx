import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export interface AlertProps {
  children: React.ReactNode;
  classNames?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'danger' | 'warning' | 'info';
  dismissable?: boolean;
  dismissLifetime?: 'refresh' | 'session';
}

export const Alert: React.FC<AlertProps> = ({
  children,
  classNames,
  color = 'primary',
  dismissable = false,
  dismissLifetime = 'refresh',
}) => {
  const [dismissed, setDismissed] = React.useState(false);

  const alertStyles = React.useMemo(() => {
    return cn([
      `alert alert-dismissible fade show mb-3 inline-flex w-full items-center rounded-lg bg-${color}-100 py-5 px-6 text-base text-${color}-700`,
      classNames,
    ]);
  }, [classNames, color]);

  const buttonStyles = React.useMemo(() => {
    return cn([
      `ml-auto rounded-none border-none text-${color}-900 opacity-50 hover:text-${color}-900 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none`,
    ]);
  }, [color]);

  React.useEffect(() => {
    if (dismissLifetime === 'session') {
      // TODO: Figure out how tracking this might work for multiple alerts.
      const dismissState = JSON.parse(
        window.sessionStorage.getItem('alertDismissed') ?? 'false',
      );
      setDismissed(dismissState);
    }
  }, [dismissLifetime]);

  const handleDismiss = React.useCallback(() => {
    setDismissed(true);

    if (dismissLifetime === 'session') {
      window.sessionStorage.setItem('alertDismissed', 'true');
    }
  }, [dismissLifetime]);

  if (dismissed) {
    return null;
  }

  return (
    <div className={alertStyles} role="alert">
      {children}
      {dismissable && (
        <button
          type="button"
          className={buttonStyles}
          onClick={handleDismiss}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
  );
};
