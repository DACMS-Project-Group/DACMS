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
      <div className="bg-primary px-4 py-4 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-poppins font-semibold text-white md:text-2xl">
              Claims
            </h1>
            <p className="mt-1 text-sm text-primary-lightest font-inter">
              Verify submitted claims and prepare approved payments for export.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Claims workspace"
            className="flex gap-1 rounded-xl bg-primary-dark p-1"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`claims-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`claims-panel-${tab.id}`}
                  onClick={() => selectTab(tab.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition font-inter ${
                    isActive
                      ? 'bg-surface text-primary'
                      : 'text-primary-lightest hover:bg-primary-light'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
    </>
  );
};

export default ClaimsWorkspace;
