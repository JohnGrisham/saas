import * as React from 'react';
import cn from 'classnames';

export interface DropdownItem {
  title: string;
  classNames?: string;
  disabled?: boolean;
  href?: string;
  onSelect?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => any;
}

export interface DropdownProps {
  children: React.ReactNode;
  items: DropdownItem[];
  classNames?: string;
  listClassNames?: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  children,
  classNames,
  disabled = false,
  items,
  listClassNames = 'left-0',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownWrapperStyles = React.useMemo(() => {
    return cn([
      `dropdown relative`,
      {
        'pointer-events-none text-decoration-none select-none': disabled,
      },
      classNames,
    ]);
  }, [classNames, disabled]);

  const dropdownListStyles = React.useMemo(() => {
    return cn([
      `absolute z-50 float-left py-2 m-0 mt-1 text-base text-inherit text-left list-none bg-white rounded-lg shadow-lg dropdown-menu min-w-max bg-clip-padding dark:bg-gray-800`,
      {
        hidden: !isOpen,
      },
      listClassNames,
    ]);
  }, [listClassNames, isOpen]);

  const getListItemStyles = React.useCallback(
    (classNames?: string, disabled?: boolean) => {
      return cn([
        `dropdown-item block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`,
        {
          'pointer-events-none text-decoration-none select-none': disabled,
        },
        classNames,
      ]);
    },
    [],
  );

  return (
    <div className={dropdownWrapperStyles}>
      <a
        className="flex items-center dropdown-toggle hidden-arrow"
        href="#"
        id="dropdownMenuButton"
        role="button"
        aria-expanded="false"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen((current) => !current);
        }}
      >
        {children}
      </a>
      <ul className={dropdownListStyles} aria-labelledby="dropdownMenuButton">
        {items.map(
          ({ classNames, disabled, href = '#', title, onSelect }, i) => (
            <li key={`${title}-${i}`}>
              <a
                className={getListItemStyles(classNames, disabled)}
                aria-disabled={disabled}
                href={disabled ? undefined : href}
                onClick={(e) => {
                  if (disabled) return;
                  if (onSelect) onSelect(e);
                  setIsOpen(false);
                }}
              >
                {title}
              </a>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};
