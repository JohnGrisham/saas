import * as React from 'react';
import { Button } from '../button';
import cn from 'classnames';
import { motion } from 'framer-motion';

export interface Step {
  header: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export interface StepperProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  steps: Step[];
  classNames?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  activeStep,
  classNames,
  setActiveStep,
  steps,
}) => {
  const styles = React.useMemo(() => {
    return cn([
      `relative p-0 m-0 w-full list-none overflow-hidden`,
      classNames,
    ]);
  }, [classNames]);

  return (
    <ul className={styles}>
      {steps.map(({ children, disabled, header }, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === activeStep;

        return (
          <li
            key={`${header}-${stepNumber}`}
            className="relative stepper-step h-fit"
          >
            <div
              className={`text-decoration-none flex items-center leading-4 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              aria-disabled={disabled}
              onClick={() => {
                if (disabled) {
                  return;
                }

                setActiveStep(stepNumber);
              }}
            >
              <Button
                color={isActive ? 'accent' : 'primary'}
                size="small"
                disabled={disabled}
                rounded
              >
                {stepNumber}
              </Button>
              <h2 className="ml-2 dark:text-white">{header}</h2>
            </div>
            <motion.section
              initial={isActive}
              animate={isActive ? 'open' : 'collapsed'}
              exit="collapsed"
              className="flex pt-4 pb-6 pr-6 overflow-hidden justify-left pl-14 dark:text-white"
              variants={{
                open: {
                  height: 'auto',
                  opacity: 1,
                  visibility: 'visible',
                  transition: {
                    bounceStiffness: 20,
                    type: 'inertia',
                    velocity: 1.5,
                  },
                },
                collapsed: {
                  height: 0,
                  visibility: 'collapse',
                  opacity: 0,
                  transition: { duration: 0.2 },
                },
              }}
            >
              {children}
            </motion.section>
          </li>
        );
      })}
    </ul>
  );
};
