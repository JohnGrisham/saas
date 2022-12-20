import * as React from 'react';
import cn from 'classnames';

export interface TableRowItem {
  id: string;
  columns: string[];
}

export interface TableProps {
  headers: string[];
  data: TableRowItem[];
  classNames?: string;
}

export const Table: React.FC<TableProps> = ({ classNames, data, headers }) => {
  const styles = React.useMemo(() => {
    return cn([`flex flex-col`, classNames]);
  }, [classNames]);

  const tableHeaders = React.useMemo(
    () =>
      headers.map((header) => (
        <th
          scope="col"
          className="px-6 py-4 text-left text-sm font-medium text-gray-900"
        >
          {header}
        </th>
      )),
    [headers],
  );

  const tableRows = React.useMemo(
    () =>
      data.map(({ id, columns }) => (
        <tr id={id} className="border-b">
          {columns.map((col) => (
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
              {col}
            </td>
          ))}
        </tr>
      )),
    [data],
  );

  React.useEffect(() => {
    if (!data.every(({ columns }) => columns.length === headers.length)) {
      throw new Error(
        'Invalid number of data columns for the provided number of table headers',
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
              <tbody>{tableRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
