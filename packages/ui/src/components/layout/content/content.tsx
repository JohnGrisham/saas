import * as React from 'react';
import cn from 'classnames';
import { useRootDomain } from '../../../hooks';
export interface BodyProps {
  children: React.ReactNode;
}

export const Content: React.FC<BodyProps> = ({ children }) => {
  const isRootDomain = useRootDomain();
  const styles = React.useMemo(() => {
    return cn([
      `ui-flex ui-min-h-[92vh] ui-bg-white dark:ui-bg-black`,
      {
        'ui-justify-center ui-p-8': isRootDomain,
      },
    ]);
  }, [isRootDomain]);

  return <main className={styles}>{children}</main>;
};
