import EmptyState from './EmptyState';

/**
 * DataTable — the standard table used across the app.
 *
 * `columns` is an array of:
 *   { key, header, render?(row, index), className?, headerClassName? }
 *
 * CompactTable remains the dense, expandable variant used by AuditLogs.
 */
const DataTable = ({
  columns,
  rows,
  getRowKey = (row, index) => row?.id ?? index,
  loading = false,
  error = '',
  emptyTitle = 'No records found',
  emptyDescription,
  minWidth = '900px',
  rowClassName = '',
  className = '',
  headerClassName = 'p-4 text-left text-sm font-semibold text-primary font-inter',
}) => (
  <div className="overflow-x-auto">
    <table className={`w-full ${className}`} style={{ minWidth }}>
      <thead className="bg-primary-lightest">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={`${headerClassName} ${
                column.headerClassName ?? ''
              }`}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length} className="p-4">
              <EmptyState title="Loading..." />
            </td>
          </tr>
        ) : error ? (
          <tr>
            <td colSpan={columns.length} className="p-4">
              <EmptyState title="Unable to load data" description={error} />
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="p-4">
              <EmptyState
                title={emptyTitle}
                description={emptyDescription}
              />
            </td>
          </tr>
        ) : (
          rows.map((row, index) => (
            <tr
              key={getRowKey(row, index)}
              className={`border-t border-neutral/30 transition hover:bg-primary-lightest/30 ${rowClassName}`}
            >
              {columns.map((column) => (
                <td key={column.key} className={column.className ?? 'p-4'}>
                  {column.render
                    ? column.render(row, index)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default DataTable;
