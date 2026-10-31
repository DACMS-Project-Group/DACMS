import { useState } from 'react';
import { useDensity } from '../contexts/DensityContext';

/**
 * CompactTable — a dense, SIEM-style data table.
 *
 * - `columns` describe headers + cell renderers
 * - `rows` is the data array (each row needs a stable `id`)
 * - `renderRowExpansion` (optional) returns JSX shown below an expanded row
 * - Density-aware padding/font via DensityContext
 */
export const CompactTable = ({
  columns,
  rows,
  renderRowExpansion,
  className = ''
}) => {
  const { density } = useDensity();
  const padY = density === 'compact' ? 'py-1.5' : 'py-3';
  const padX = 'px-3';
  const cellFont = density === 'compact' ? 'text-xs' : 'text-sm';
  const headerFont = 'text-[11px]';

  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpansion = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const chevron = (open) => (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  return (
    <div
      className={`overflow-x-auto border border-neutral/20 rounded-xl shadow-sm bg-white ${className}`}
    >
      <table className="w-full text-left border-collapse">
        <thead className="bg-primary-lightest sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${padX} ${padY} ${headerFont} font-semibold uppercase tracking-wider text-primary align-middle`}
                scope="col"
              >
                {col.label}
              </th>
            ))}
            {renderRowExpansion && (
              <th
                className={`${padX} ${padY} w-8 text-center`}
                scope="col"
              />
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral/10">
          {rows.map((row) => {
            const isExpanded = expandedIds.has(row.id);
            return (
              <tr
                key={row.id}
                className="transition-colors hover:bg-primary-lightest/40 group odd:bg-white even:bg-off-white/60"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${padX} ${padY} ${cellFont} text-neutral align-middle`}
                  >
                    {col.render(row)}
                  </td>
                ))}
                {renderRowExpansion && (
                  <td className={`${padX} ${padY} text-center`}>
                    <button
                      onClick={() => toggleExpansion(row.id)}
                      className="p-1 rounded hover:bg-neutral/100 transition-colors"
                      aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                      title={isExpanded ? 'Collapse details' : 'Expand details'}
                    >
                      {chevron(isExpanded)}
                    </button>
                  </td>
                )}
              </tr>
            );
          })}

          {rows.map((row) => {
            const isExpanded = expandedIds.has(row.id);
            if (!isExpanded || !renderRowExpansion) return null;

            return (
              <tr key={`${row.id}-expansion`} className="bg-primary-lightest/30">
                <td
                  colSpan={columns.length + (renderRowExpansion ? 1 : 0)}
                  className={`${padX} ${padY} ${cellFont} text-neutral`}
                >
                  <div className="border-l border-primary pl-3 pt-2">
                    {renderRowExpansion(row)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
