import * as React from 'react';
import cn from 'classnames';
import { useRootDomain } from '../../../hooks';
export interface BodyProps {
  children: React.ReactNode;
}

export const Body: React.FC<BodyProps> = ({ children }) => {
  const isRootDomain = useRootDomain();
  const styles = React.useMemo(() => {
    return cn([
      `flex h-full min-h-[92vh] bg-white dark:bg-black`,
      {
        'justify-center p-8': isRootDomain,
      },
    ]);
  }, [isRootDomain]);

  return <main className={styles}>{children}</main>;
};
