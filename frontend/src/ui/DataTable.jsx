import { useMemo, useState } from 'react';
import Button from './Button';
import EmptyState from './EmptyState';

/**
 * DataTable — the standard table used across the app.
 *
 * `columns` is an array of:
 *   { key, header, render?(row, index), className?, headerClassName?,
 *     sortable?, sortValue?(row) }
 *
 * Sorting and pagination are client-side. Set `sortable={false}` or
 * `pageSize={0}` to opt out. CompactTable remains the dense, expandable
 * variant used by AuditLogs.
 */
const NON_SORTABLE_KEYS = ['action', 'actions', 'select'];

const defaultCompare = (a, b) => {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

const DataTable = ({
  columns,
  rows = [],
  getRowKey = (row, index) => row?.id ?? index,
  loading = false,
  error = '',
  emptyTitle = 'No records found',
  emptyDescription,
  minWidth = '900px',
  rowClassName = '',
  className = '',
  headerClassName = 'p-4 text-left text-sm font-semibold text-primary font-inter',
  sortable = true,
  pageSize = 10,
}) => {
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(0);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;

    const column = columns.find((item) => item.key === sort.key);

    if (!column) return rows;

    const valueOf = (row) =>
      column.sortValue ? column.sortValue(row) : row[column.key];

    return [...rows].sort((a, b) => {
      const result = defaultCompare(valueOf(a), valueOf(b));

      return sort.direction === 'asc' ? result : -result;
    });
  }, [columns, rows, sort]);

  const totalPages =
    pageSize > 0 ? Math.max(1, Math.ceil(sortedRows.length / pageSize)) : 1;
  const currentPage = Math.min(page, totalPages - 1);
  const visibleRows =
    pageSize > 0
      ? sortedRows.slice(
          currentPage * pageSize,
          currentPage * pageSize + pageSize
        )
      : sortedRows;

  const toggleSort = (column) => {
    if (
      !sortable ||
      column.sortable === false ||
      NON_SORTABLE_KEYS.includes(column.key)
    ) {
      return;
    }

    setSort((current) => {
      if (!current || current.key !== column.key) {
        return { key: column.key, direction: 'asc' };
      }

      if (current.direction === 'asc') {
        return { key: column.key, direction: 'desc' };
      }

      return null;
    });
    setPage(0);
  };

  const renderSortIndicator = (column) => {
    if (
      !sortable ||
      column.sortable === false ||
      NON_SORTABLE_KEYS.includes(column.key)
    ) {
      return null;
    }

    if (sort?.key !== column.key) {
      return <span className="ml-1 text-neutral/50">↕</span>;
    }

    return (
      <span className="ml-1 text-primary">
        {sort.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const renderValue = (row, column, index) =>
    column.render ? column.render(row, index) : row[column.key];

  const renderRowClassName = (row, index) =>
    typeof rowClassName === 'function'
      ? rowClassName(row, index)
      : rowClassName;

  const stateRow = loading ? (
    <EmptyState title="Loading..." />
  ) : error ? (
    <EmptyState title="Unable to load data" description={error} />
  ) : (
    <EmptyState title={emptyTitle} description={emptyDescription} />
  );

  if (loading || error || rows.length === 0) {
    return <div className="px-1 py-2">{stateRow}</div>;
  }

  return (
    <div>
      {/* Mobile card fallback */}
      <div className="divide-y divide-neutral/30 md:hidden">
        {visibleRows.map((row, index) => (
          <div
            key={getRowKey(row, index)}
            className={`px-1 py-3 ${renderRowClassName(row, index)}`}
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className="flex items-start justify-between gap-4 py-1"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-neutral">
                  {column.header}
                </span>

                <span className="min-w-0 text-right text-sm text-dark">
                  {renderValue(row, column, index)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className={`w-full ${className}`} style={{ minWidth }}>
          <thead className="bg-primary-lightest">
            <tr>
              {columns.map((column) => {
                const isSortable =
                  sortable &&
                  column.sortable !== false &&
                  !NON_SORTABLE_KEYS.includes(column.key);
                const ariaSort =
                  sort?.key === column.key
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none';

                return (
                  <th
                    key={column.key}
                    aria-sort={isSortable ? ariaSort : undefined}
                    className={`${headerClassName} ${
                      column.headerClassName ?? ''
                    }`}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column)}
                        className="inline-flex items-center font-semibold transition hover:text-primary-dark"
                      >
                        {column.header}
                        {renderSortIndicator(column)}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className={`border-t border-neutral/30 transition hover:bg-primary-lightest/30 ${renderRowClassName(
                  row,
                  index
                )}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className={column.className ?? 'p-4'}>
                    {renderValue(row, column, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageSize > 0 && totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-neutral/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral font-inter">
            Showing {currentPage * pageSize + 1}–
            {Math.min((currentPage + 1) * pageSize, sortedRows.length)} of{' '}
            {sortedRows.length}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setPage((value) => Math.max(0, value - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>

            <span className="px-2 text-sm text-neutral font-inter">
              Page {currentPage + 1} of {totalPages}
            </span>

            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() =>
                setPage((value) => Math.min(totalPages - 1, value + 1))
              }
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
