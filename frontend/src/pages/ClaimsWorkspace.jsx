import Button from '../ui/Button';
import PageHeader from '../ui/PageHeader';
import { useSearchParams } from 'react-router-dom';
import ClaimsVerification from './ClaimsVerification';
import ExportPayments from './ExportPayments';

const TABS = [
  { id: 'verify', label: 'Verify claims' },
  { id: 'export', label: 'Export payments' },
];

const ClaimsWorkspace = () => {
  document.title = 'AACMS - Claims';

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'export' ? 'export' : 'verify';

  const selectTab = (tab) => {
    const next = new URLSearchParams(searchParams);

    if (tab === 'verify') next.delete('tab');
    else next.set('tab', tab);

    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <div className="p-4 md:p-8">
        <PageHeader
          title="Claims"
          description="Verify submitted claims and prepare approved payments for export."
          actions={
            <div
              role="tablist"
              aria-label="Claims workspace"
              className="flex gap-1 rounded-xl bg-light-grey p-1"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <Button unstyled
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`claims-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`claims-panel-${tab.id}`}
                    onClick={() => selectTab(tab.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition font-inter ${
                      isActive
                        ? 'bg-surface text-primary shadow-sm'
                        : 'text-neutral hover:bg-primary-lightest hover:text-primary'
                    }`}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          }
        />

        <div
          role="tabpanel"
          id={`claims-panel-${activeTab}`}
          aria-labelledby={`claims-tab-${activeTab}`}
        >
          {activeTab === 'verify' ? (
            <ClaimsVerification embedded />
          ) : (
            <ExportPayments embedded />
          )}
        </div>
      </div>
    </>
  );
};

export default ClaimsWorkspace;
