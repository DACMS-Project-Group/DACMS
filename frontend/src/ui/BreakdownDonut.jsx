import { formatNumber } from '../lib/format';

const SIZE = 160;
const STROKE = 20;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * BreakdownDonut — SVG donut with a built-in legend.
 *
 * `segments` is an array of { label, value, color }.
 */
const BreakdownDonut = ({
  segments = [],
  centerLabel = 'Total',
  formatValue = (value) => formatNumber(value, 0),
}) => {
  const total = segments.reduce(
    (sum, segment) => sum + Number(segment.value ?? 0),
    0
  );

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative shrink-0">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={`${centerLabel}: ${formatValue(total)}`}
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-light-grey)"
            strokeWidth={STROKE}
          />

          {total > 0 &&
            segments.map((segment) => {
              const value = Number(segment.value ?? 0);

              if (!value) return null;

              const portion = (value / total) * CIRCUMFERENCE;
              const dashOffset = -offset;
              offset += portion;

              return (
                <circle
                  key={segment.label}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${portion} ${CIRCUMFERENCE - portion}`}
                  strokeDashoffset={dashOffset}
                  transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                >
                  <title>{`${segment.label}: ${formatValue(value)}`}</title>
                </circle>
              );
            })}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-primary-dark font-poppins">
            {formatValue(total)}
          </span>

          <span className="text-[10px] uppercase tracking-wide text-neutral font-inter">
            {centerLabel}
          </span>
        </div>
      </div>

      <ul className="w-full space-y-3">
        {segments.map((segment) => {
          const value = Number(segment.value ?? 0);
          const share = total > 0 ? Math.round((value / total) * 100) : 0;

          return (
            <li
              key={segment.label}
              className="flex items-center justify-between gap-3 text-sm font-inter"
            >
              <span className="flex min-w-0 items-center gap-2 text-dark">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate">{segment.label}</span>
              </span>

              <span className="shrink-0 font-semibold text-primary-dark">
                {formatValue(value)}
                <span className="ml-1 text-xs font-normal text-neutral">
                  ({share}%)
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BreakdownDonut;
