/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import cn from 'classnames';

export interface AvatarProps {
  imageSrc: string;
  classNames?: string;
  title?: string;
  description?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  classNames,
  description,
  imageSrc,
  title,
}) => {
  const styles = React.useMemo(() => {
    return cn([`avatar text-center`, classNames]);
  }, [classNames]);

  return (
    <div className={styles}>
      <img
        src={imageSrc}
        className="mx-auto mb-4 w-32 rounded-full"
        alt="Avatar"
      />
      {title && (
        <h5 className="mb-2 text-xl font-medium leading-tight dark:text-white">
          John Doe
        </h5>
      )}
      {description && (
        <p className="text-gray-500 dark:text-white">Web designer</p>
      )}
    </div>
  );
};
