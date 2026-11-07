import { useNavigate } from 'react-router-dom';
import Button from './Button';
import EmptyState from './EmptyState';
import Card from '../components/Card';

const WorkQueue = ({
  items = [],
  loading = false,
  loadingMessage = 'Checking for outstanding items…',
  emptyTitle = 'Nothing needs your attention',
  emptyDescription,
  emptyAction,
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      {loading ? (
        <p className="py-4 text-sm text-neutral font-inter">{loadingMessage}</p>
      ) : items.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={
            emptyAction?.label ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(emptyAction.to)}
              >
                {emptyAction.label}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="divide-y divide-border-subtle">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-primary-lightest px-2 font-poppins text-sm font-semibold text-primary">
                  {item.count}
                </span>

                <p className="text-dark font-inter">{item.label}</p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(item.to)}
              >
                {item.cta}
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default WorkQueue;
