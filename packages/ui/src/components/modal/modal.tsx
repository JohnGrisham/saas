import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { toCamelCase } from '../../../../core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export interface ModalProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
  classNames?: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  classNames,
  isOpen,
  title,
  footer,
  onClose,
}) => {
  const styles = React.useMemo(() => {
    return cn([
      `modal fade fixed top-0 left-0 h-full w-full overflow-y-auto overflow-x-hidden outline-none`,
      {
        hidden: !isOpen,
      },
      classNames,
    ]);
  }, [classNames, isOpen]);

  const titleCamel = React.useMemo(() => toCamelCase(title), [title]);
  const label = React.useMemo(() => `${titleCamel}ModelLabel`, [titleCamel]);

  return (
    <div
      className={styles}
      id={titleCamel}
      tabIndex={-1}
      aria-labelledby={label}
      aria-hidden="true"
    >
      <div className="modal-dialog pointer-events-none relative w-auto">
        <div className="modal-content pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none">
          <div className="modal-header flex flex-shrink-0 items-center justify-between rounded-t-md border-b border-gray-200 p-4">
            <h5
              className="text-xl font-medium leading-normal text-gray-800"
              id={label}
            >
              {title}
            </h5>
            <button
              type="button"
              className="box-content h-4 w-4 rounded-none border-none p-1 text-black opacity-50 hover:text-black hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="modal-body relative p-4">{children}</div>
          <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t border-gray-200 p-4">
            {!footer ? (
              <button
                type="button"
                className="rounded bg-purple-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg"
                onClick={onClose}
              >
                Close
              </button>
            ) : (
              footer
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
