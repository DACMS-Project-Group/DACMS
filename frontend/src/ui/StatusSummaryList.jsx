import { formatMoney, formatNumber } from '../lib/format';

const StatusSummaryList = ({
  items = [],
  total,
  formatCount = (value) => formatNumber(value, 0),
  showAmount = true,
}) => {
  const safeTotal = Number(
    total ?? items.reduce((sum, item) => sum + Number(item.value ?? 0), 0)
  );

  return (
    <div>
      {safeTotal > 0 && (
        <div
          className="mb-4 flex h-2 overflow-hidden rounded-full bg-light-grey"
          role="img"
          aria-label="Status distribution"
        >
          {items.map((item) => {
            const value = Number(item.value ?? 0);

            if (!value) return null;

            return (
              <span
                key={item.label}
                className="h-full"
                style={{
                  width: `${(value / safeTotal) * 100}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.label}: ${formatCount(value)}`}
              />
            );
          })}
        </div>
      )}

      <ul className="divide-y divide-border-subtle">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm text-dark font-inter">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate">{item.label}</span>
            </span>

            <span className="shrink-0 text-right">
              <span className="block text-lg font-semibold text-primary-dark font-poppins">
                {formatCount(item.value)}
              </span>

              {showAmount && item.amount !== undefined && (
                <span className="block text-xs text-neutral font-inter">
                  {formatMoney(item.amount)}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusSummaryList;
