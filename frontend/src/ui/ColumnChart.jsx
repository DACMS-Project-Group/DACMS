/**
 * ColumnChart — compact stacked column chart built from divs, so labels stay
 * crisp and the chart fills its container at any width.
 *
 * `data` is an array of:
 *   { key, label, total, value, title? }
 *
 * `total` is the faint background column and `value` the emphasised overlay.
 */
const ColumnChart = ({
  data = [],
  height = 96,
  totalColor = 'var(--color-primary-lightest)',
  valueColor = 'var(--color-primary-dark)',
  ariaLabel = 'Column chart',
}) => {
  const max = Math.max(1, ...data.map((point) => Number(point.total) || 0));

  return (
    <div role="img" aria-label={ariaLabel} className="w-full">
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((point) => {
          const total = Number(point.total) || 0;
          const value = Number(point.value) || 0;
          const totalHeight = (total / max) * height;
          const valueHeight = total > 0 ? (value / max) * height : 0;

          return (
            <div
              key={point.key}
              className="flex h-full min-w-0 flex-1 items-end"
              title={
                point.title ??
                `${point.label}: ${value} of ${total} applications pending`
              }
            >
              <div
                className="relative w-full rounded-sm"
                style={{ height: `${totalHeight}px`, background: totalColor }}
              >
                <div
                  className="absolute inset-x-0 bottom-0 rounded-sm"
                  style={{
                    height: `${valueHeight}px`,
                    background: valueColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-1 flex gap-1 border-t border-border-subtle pt-1">
        {data.map((point) => (
          <span
            key={point.key}
            className="min-w-0 flex-1 text-center text-[9px] text-neutral font-inter"
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ColumnChart;
