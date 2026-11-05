import { useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import Button from './Button';
import PageHeader from './PageHeader';
import Card from '../components/Card';

const DetailPage = ({
  title,
  description,
  breadcrumbs,
  backTo,
  backLabel = 'Back',
  actions,
  loading = false,
  loadingMessage = 'Loading details...',
  error,
  errorTitle = 'Could not load details',
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8">
      {breadcrumbs?.length ? (
        <Breadcrumbs items={breadcrumbs} />
      ) : null}

      <PageHeader
        title={title}
        description={description}
        actions={actions}
      />

      {!breadcrumbs?.length && backTo ? (
        <div className="mb-6">
          <Button
            unstyled
            type="button"
            onClick={() => navigate(backTo)}
            className="font-medium text-primary transition hover:text-primary-dark"
          >
            ← {backLabel}
          </Button>
        </div>
      ) : null}

      {loading ? (
        <Card>
          <p className="py-8 text-center text-neutral font-inter">
            {loadingMessage}
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="font-semibold text-error font-inter">{errorTitle}</p>

          <p className="mt-1 text-sm text-neutral font-inter">{error}</p>

          {backTo && (
            <Button className="mt-6" onClick={() => navigate(backTo)}>
              {backLabel}
            </Button>
          )}
        </Card>
      ) : (
        children
      )}
    </div>
  );
};

export default DetailPage;
