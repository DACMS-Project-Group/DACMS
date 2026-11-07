import { useId } from 'react';

/**
 * DonutChart — lightweight SVG donut used for status breakdowns.
 *
 * `segments` is an array of:
 *   { key, label?, value, color, striped? }
 *
 * Striped segments are filled with a diagonal pattern in `color`, used for
 * categories that do not map to a single known status.
 */
const DonutChart = ({
  segments = [],
  size = 112,
  thickness = 18,
  centerValue,
  centerLabel = 'total',
  ariaLabel = 'Chart',
}) => {
  const patternID = `${useId().replace(/:/g, '')}-stripes`;
  const stripedColor =
    segments.find((segment) => segment.striped)?.color ?? '#D9C9E6';

  const total = segments.reduce(
    (sum, segment) => sum + (Number(segment.value) || 0),
    0
  );
  const center = size / 2;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const arcs = segments
    .map((segment, index) => {
      const value = Number(segment.value) || 0;
      if (value <= 0) return null;

      const length = (value / total) * circumference;
      const previousValue = segments
        .slice(0, index)
        .reduce((sum, prev) => sum + (Number(prev.value) || 0), 0);

      return {
        ...segment,
        value,
        length,
        offset: (previousValue / total) * circumference,
      };
    })
    .filter(Boolean);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
      className="shrink-0"
    >
      <defs>
        <pattern
          id={patternID}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="8" height="8" fill={stripedColor} />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke="#FFFFFF"
            strokeOpacity="0.7"
            strokeWidth="3"
          />
        </pattern>
      </defs>

      <g transform={`rotate(-90 ${center} ${center})`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-light-grey)"
          strokeWidth={thickness}
        />

        {arcs.map((arc) => (
          <circle
            key={arc.key}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={arc.striped ? `url(#${patternID})` : arc.color}
            strokeWidth={thickness}
            strokeDasharray={`${arc.length} ${circumference - arc.length}`}
            strokeDashoffset={-arc.offset}
          />
        ))}
      </g>

      <text
        x={center}
        y={center - 1}
        textAnchor="middle"
        className="fill-primary-dark font-poppins"
        fontSize="20"
        fontWeight="700"
      >
        {centerValue ?? total}
      </text>

      <text
        x={center}
        y={center + 14}
        textAnchor="middle"
        className="fill-neutral font-inter"
        fontSize="10"
      >
        {centerLabel}
      </text>
    </svg>
  );
};

export default DonutChart;
