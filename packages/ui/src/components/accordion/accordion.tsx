import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export interface AccordionProps {
  children: React.ReactNode;
  classNames?: string;
  disabled?: boolean;
  header: string;
  initialCollapsed?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  classNames,
  disabled = false,
  header,
  initialCollapsed = true,
}) => {
  const [collapsed, setCollapsed] = React.useState(initialCollapsed);

  const accordionStyles = React.useMemo(() => {
    return cn([
      `accordion-item border border-gray-200 bg-white overflow-hidden dark:bg-zinc-700 dark:text-white`,
      {
        [`cursor-not-allowed text-decoration-none`]: disabled,
      },
      classNames,
    ]);
  }, [classNames, disabled]);

  const headerStyles = React.useMemo(() => {
    return cn([
      `accordion-header accordion-button relative mb-0
      flex
      w-full
      select-none
      items-center
      rounded-none
      border-0 bg-inherit py-4
      px-5
      justify-between
      text-left
      text-base
      transition
      focus:outline-none`,
      {
        [`border-b border-primary-200 text-primary-500`]: !collapsed,
        [`cursor-pointer`]: !disabled,
        [`pointer-events-none`]: disabled,
      },
    ]);
  }, [collapsed, disabled]);

  return (
    <div className="accordion w-full">
      <div className={accordionStyles}>
        <motion.h2
          className={headerStyles}
          initial={collapsed}
          onClick={() => setCollapsed((state) => !state)}
        >
          {header}
          <motion.div
            animate={collapsed ? 'collapsed' : 'open'}
            initial="collapsed"
            exit="collapsed"
            transition={{ duration: 0.2 }}
            variants={{ open: { rotate: -180 }, collapsed: { rotate: 0 } }}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </motion.div>
        </motion.h2>
        <AnimatePresence initial={collapsed}>
          {!collapsed && (
            <motion.section
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              className="accordion-body py-4 px-5 text-black dark:text-white"
              variants={{
                open: { height: 'auto', visibility: 'visible' },
                collapsed: { height: 0, visibility: 'collapse' },
              }}
              transition={{
                bounceStiffness: 50,
                type: 'inertia',
                velocity: 1.35,
              }}
            >
              {children}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
