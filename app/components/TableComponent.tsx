'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface Props<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
  pagination?: boolean;
}

const TableComponent = <T extends object>({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
  pagination = true,
}: Props<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="flex dark:bg-black-600 bg-white flex-col gap-5 rounded-lg">
      <div className="flex flex-col gap-3">
        <div className="overflow-x-auto">
          <table className="divide-y divide-gray-200 dark:divide-black-700 w-full">
            <thead className="bg-white dark:bg-black-600">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-grey-700 tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-black-600 divide-y divide-gray-200 dark:divide-black-700">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-primary dark:bg-black-600">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-primary font-medium whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="flex items-center justify-between pb-2 px-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border px-3 py-1 rounded-md dark:border-black-700 bg-white dark:bg-black-600 text-sm dark:text-grey-400 text-black-100"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className=" border px-3 py-1 rounded-md dark:border-black-700 bg-white dark:bg-black-600 dark:text-grey-400 text-sm text-black-100"
              >
                Next
              </button>
            </div>
            <div className="text-sm text-grey-100 dark:text-grey-400 font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableComponent;
