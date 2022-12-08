import * as React from 'react';
import cn from 'classnames';

export interface CardProps {
  title?: string;
  children?: React.ReactNode;
  classNames?: string;
  description?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  classNames,
  description,
  title,
}) => {
  const styles = React.useMemo(() => {
    return cn([`flex justify-center`, classNames]);
  }, [classNames]);

  return (
    <div className={styles}>
      <div className="block max-w-sm rounded-lg bg-white p-6 shadow-lg">
        {title && (
          <h5 className="mb-2 text-xl font-medium leading-tight text-gray-900">
            {title}
          </h5>
        )}
        {description && (
          <p className="mb-4 text-base text-gray-700">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
};
