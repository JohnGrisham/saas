import { Table, TableRowItem } from './table';

const table = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Table',
  component: Table,
};

export default table;

export const Basic = () => {
  const headers = ['#', 'First', 'Last'];
  const data: TableRowItem[] = [
    { id: '1', columns: ['1', 'John', 'Doe'] },
    { id: '2', columns: ['2', 'Jane', 'Doe'] },
  ];

  return (
    <div className="flex flex-col justify-center">
      <Table data={data} headers={headers} />
    </div>
  );
};
