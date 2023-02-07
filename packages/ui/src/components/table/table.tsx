import * as React from 'react';
import { Button, ButtonProps } from '../button';
import cn from 'classnames';
import split from 'just-split';

export interface TableRowItem {
  id: string;
  cells: string[];
}

export interface TableProps {
  headers: string[];
  data: TableRowItem[];
  currentPage?: number;
  classNames?: string;
  pageCount?: number;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
}

export const Table: React.FC<TableProps> = ({
  classNames,
  currentPage = 1,
  data,
  headers,
  pageCount = 10,
  setCurrentPage,
}) => {
  const [page, setPage] = React.useState(currentPage);
  const styles = React.useMemo(() => {
    return cn([`flex flex-col text-gray-900 dark:text-white`, classNames]);
  }, [classNames]);

  const tableHeaders = React.useMemo(
    () =>
      headers.map((header, i) => (
        <th
          key={`${header}-${i}`}
          scope="col"
          className="px-6 py-4 text-sm font-medium text-left"
        >
          {header}
        </th>
      )),
    [headers],
  );

  const tableRows = React.useMemo(
    () =>
      split(data, pageCount).map((pageItems) => {
        return pageItems.map(({ id, cells }) => (
          <tr
            id={id}
            key={id}
            className="transition duration-300 ease-in-out border-b hover:bg-accent-100"
          >
            {cells.map((cell) => (
              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                {cell}
              </td>
            ))}
          </tr>
        ));
      }),
    [data, pageCount],
  );

  const getPageLinkStyles = React.useCallback(
    (pageNum: number) => {
      return cn([
        `page-link relative block rounded rounded border-0 py-1.5 px-3 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none dark:text-white dark:hover:text-gray-800`,
        {
          [`bg-primary-600 text-white`]: page === pageNum,
        },
      ]);
    },
    [page],
  );

  const getPageNavProps = React.useCallback(
    (navType: 'Previous' | 'Next'): ButtonProps => {
      const disabled =
        (navType === 'Previous' && page === 1) ||
        (navType === 'Next' && page === tableRows.length);

      return {
        children: navType,
        className: cn([
          `page-link relative block rounded rounded border-0 py-1.5 px-3 outline-none transition-all duration-300 focus:shadow-none hover:text-gray-800 hover:bg-gray-200 focus:shadow-none`,
          {
            'bg-transparent pointer-events-none text-gray-500': disabled,
          },
        ]),
        type: 'button',
        link: true,
        disabled,
        onClick: () => {
          if (navType === 'Previous') {
            setCurrentPage
              ? setCurrentPage((current) => current - 1)
              : setPage((current) => current - 1);
          } else {
            setCurrentPage
              ? setCurrentPage((current) => current + 1)
              : setPage((current) => current + 1);
          }
        },
      };
    },
    [page, setCurrentPage, tableRows],
  );

  React.useEffect(() => {
    if (!data.every(({ cells }) => cells.length === headers.length)) {
      throw new Error(
        'Invalid number of data cells for the provided number of table headers',
      );
    }
  }, [data, headers]);

  return (
    <div className={styles}>
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>{tableHeaders}</tr>
              </thead>
              <tbody>{tableRows[page - 1]}</tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <nav aria-label="Page navigation example">
          <ul className="flex list-style-none">
            <li className="page-item disabled">
              <Button tabIndex={-1} {...getPageNavProps('Previous')} />
            </li>
            {tableRows.map((_p, i) => {
              const pageNum = i + 1;

              return (
                <li className="page-item">
                  <Button
                    className={getPageLinkStyles(pageNum)}
                    type="button"
                    onClick={() =>
                      setCurrentPage
                        ? setCurrentPage(pageNum)
                        : setPage(pageNum)
                    }
                    link
                  >
                    {pageNum}
                  </Button>
                </li>
              );
            })}
            <li className="page-item">
              <Button {...getPageNavProps('Next')} />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
