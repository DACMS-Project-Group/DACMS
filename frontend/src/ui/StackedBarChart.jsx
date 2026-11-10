const PALETTE = [
  '#3F1D5A',
  '#8B5FA8',
  '#5A3280',
  '#B08BC9',
  '#6C3D91',
  '#C9A9DE',
  '#4A2568',
  '#9B6FB8',
  '#7A4E9B',
  '#D9C4E8',
  '#552E78',
  '#A57CC0',
];

const StackedBarChart = ({
  data = [],
  modules = [],
  formatValue = (value) => value,
  formatAxis = formatValue,
  heightClass = 'h-56',
  emptyMessage = 'No data to display.',
}) => {
  if (!data.length) {
    return (
      <p className="py-8 text-center text-sm text-neutral font-inter">
        {emptyMessage}
      </p>
    );
  }

  const maxTotal = Math.max(...data.map((month) => month.total ?? 0), 1);
  const colorByModule = modules.reduce((colors, module, index) => {
    colors[module] = PALETTE[index % PALETTE.length];
    return colors;
  }, {});

  const gridTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div role="img" aria-label="Monthly totals stacked by category">
      <div className="flex gap-3">
        <div
          className={`flex ${heightClass} flex-col justify-between text-right text-[10px] leading-none text-neutral font-inter`}
        >
          <span>{formatAxis(maxTotal)}</span>
          <span>{formatAxis(maxTotal / 2)}</span>
          <span>0</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className={`relative ${heightClass}`}>
            {gridTicks.map((tick) => (
              <div
                key={tick}
                className="absolute inset-x-0 border-t border-border-subtle"
                style={{ bottom: `${tick * 100}%` }}
              />
            ))}

            <div className="absolute inset-0 flex items-end gap-1 sm:gap-2">
              {data.map((month) => {
                const total = Number(month.total ?? 0);
                const barHeight = (total / maxTotal) * 100;

                return (
                  <div
                    key={month.key}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                  >
                    <div
                      className="flex w-full max-w-12 flex-col-reverse overflow-hidden rounded-t"
                      style={{ height: `${barHeight}%` }}
                    >
                      {modules.map((module) => {
                        const value = Number(month.segments?.[module] ?? 0);

                        if (!value) return null;

                        const share = total > 0 ? (value / total) * 100 : 0;

                        return (
                          <div
                            key={module}
                            className="w-full transition-opacity hover:opacity-80"
                            style={{
                              height: `${share}%`,
                              backgroundColor: colorByModule[module],
                            }}
                            title={`${module} — ${month.label}: ${formatValue(value)}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-2 flex gap-1 sm:gap-2">
            {data.map((month) => (
              <div
                key={month.key}
                className="min-w-0 flex-1 truncate text-center text-[10px] text-neutral font-inter"
                title={month.label}
              >
                {month.label?.split(' ')[0] ?? ''}
              </div>
            ))}
          </div>
        </div>
      </div>

      {modules.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {modules.map((module) => (
            <div
              key={module}
              className="flex items-center gap-1.5 text-[11px] text-neutral font-inter"
            >
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: colorByModule[module] }}
              />
              {module}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StackedBarChart;
