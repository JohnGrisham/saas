import * as React from 'react';
import type { ComponentProps } from 'react';
import Image from 'next/image';
import cn from 'classnames';

interface BlurImageProps extends ComponentProps<typeof Image> {
  alt: string;
  classNames?: string;
}

export const BlurImage: React.FC<BlurImageProps> = ({
  alt,
  classNames,
  ...props
}) => {
  const [isLoading, setLoading] = React.useState(true);

  const styles = React.useMemo(
    () =>
      cn([
        `duration-700 ease-in-out grayscale-0 blur-0 scale-100`,
        {
          'grayscale blur-2xl scale-110': isLoading,
        },
        classNames,
      ]),
    [classNames, isLoading],
  );

  return (
    <Image
      {...props}
      alt={alt}
      className={styles}
      onLoadingComplete={() => setLoading(false)}
    />
  );
};
