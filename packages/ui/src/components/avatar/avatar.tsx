/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import cn from 'classnames';

export interface AvatarProps {
  imageSrc: string;
  classNames?: string;
  title?: string;
  description?: string;
  width?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  classNames,
  description,
  imageSrc,
  title,
  width = 32,
}) => {
  const avatarWrapperStyles = React.useMemo(() => {
    return cn([`avatar text-center`, classNames]);
  }, [classNames]);

  const avatarImageStyles = React.useMemo(() => {
    return cn([
      `mx-auto w-${width} rounded-full`,
      {
        ['mb-4']: title,
      },
    ]);
  }, [title, width]);

  return (
    <div className={avatarWrapperStyles}>
      <img src={imageSrc} className={avatarImageStyles} alt="Avatar" />
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
