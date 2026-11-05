import Button from '../ui/Button';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../ui/DataTable';
import PageHeader from '../ui/PageHeader';
import Section from '../ui/Section';
import Toast from '../ui/Toast';
import { formatDate, formatMoney } from '../lib/format';
import { apiGet } from '../api';

const ExportPayments = ({ embedded = false }) => {
  document.title = 'AACMS - Export Payments';
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [claims, setClaims] = useState([]);
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    apiGet('/admin/claims/export')
      .then((result) => {
        if (!Array.isArray(result?.claims)) {
          throw new Error('The server returned an invalid claims response.');
        }
        if (isMounted) setClaims(result.claims);
      })
      .catch((requestError) => {
        console.error('Error loading claims for payment export:', requestError);
        if (isMounted) setError(requestError.message || 'Could not load claims.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredClaims = claims.filter((claim) => {
    const matchesSearch = [
      claim.reference_number,
      claim.id,
      claim.student,
      claim.module,
    ].some((value) => String(value ?? '').toLowerCase().includes(normalizedSearch));
    const claimDate = new Date(claim.date).toISOString().slice(0, 10);

    return matchesSearch
      && (!dateFrom || claimDate >= dateFrom)
      && (!dateTo || claimDate <= dateTo);
  });

  const toggleClaim = (id) => {
    if (selectedClaims.includes(id)) {
      setSelectedClaims(
        selectedClaims.filter((claimId) => claimId !== id)
      );
    } else {
      setSelectedClaims([
        ...selectedClaims,
        id,
      ]);
    }
  };

  const toggleAll = () => {
    const visibleIds = filteredClaims.map((claim) => claim.id);
    const allVisibleSelected = visibleIds.every((id) => selectedClaims.includes(id));

    if (allVisibleSelected) {
      setSelectedClaims(selectedClaims.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedClaims([...new Set([...selectedClaims, ...visibleIds])]);
    }
  };

  const selectedClaimData = claims.filter((claim) =>
    selectedClaims.includes(claim.id)
  );

  const totalHours = selectedClaimData.reduce(
    (total, claim) => total + claim.hours,
    0
  );

  const totalPayment = selectedClaimData.reduce(
    (total, claim) => total + claim.amount,
    0
  );

  const formatCurrency = (amount) => formatMoney(amount);

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    if (!selectedClaimData.length) {
      setError('Please select at least one claim to export.');
      return;
    }

    const columns = [
      ['Claim ID', (claim) => claim.reference_number || claim.id],
      ['Student', (claim) => claim.student],
      ['Module', (claim) => claim.module],
      ['Hours', (claim) => claim.hours],
      ['Rate', (claim) => claim.rate],
      ['Amount', (claim) => claim.amount],
      ['Status', (claim) => claim.status],
      ['Date', (claim) => new Date(claim.date).toISOString().slice(0, 10)],
    ];
    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const rows = [
      columns.map(([heading]) => escapeCsv(heading)).join(','),
      ...selectedClaimData.map((claim) =>
        columns.map(([, getValue]) => escapeCsv(getValue(claim))).join(',')
      ),
    ];

    setError('');
    downloadFile(
      new Blob([`\uFEFF${rows.join('\r\n')}`], { type: 'text/csv;charset=utf-8' }),
      'payment-claims.csv'
    );
  };

  const exportPDF = async () => {
    if (!selectedClaimData.length) {
      setError('Please select at least one claim to export.');
      return;
    }

    setError('');
    setExporting(true);
    try {
      const response = await fetch('/api/admin/claims/export', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claims: selectedClaimData.map((claim) => claim.id) }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || result?.message || `Export failed (${response.status}).`);
      }

      downloadFile(await response.blob(), 'payment-claims.zip');
    } catch (exportError) {
      console.error('Error exporting claims as PDF:', exportError);
      setError(exportError.message || 'Could not export claims.');
    } finally {
      setExporting(false);
    }
  };

  const exportDates = selectedClaimData
    .map((claim) => new Date(claim.date))
    .sort((first, second) => first - second);
  const formatPeriodDate = (value) =>
    value.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
  const exportPeriod = exportDates.length
    ? formatPeriodDate(exportDates[0]) === formatPeriodDate(exportDates[exportDates.length - 1])
      ? formatPeriodDate(exportDates[0])
      : `${formatPeriodDate(exportDates[0])} - ${formatPeriodDate(exportDates[exportDates.length - 1])}`
    : 'â€”';

  const claimColumns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={
            filteredClaims.length > 0 &&
            filteredClaims.every((claim) =>
              selectedClaims.includes(claim.id)
            )
          }
          onChange={toggleAll}
          className="h-4 w-4 accent-primary"
        />
      ),
      className: 'px-5 py-5',
      headerClassName: 'px-5 py-4 text-left',
      render: (claim) => (
        <input
          type="checkbox"
          checked={selectedClaims.includes(claim.id)}
          onChange={() => toggleClaim(claim.id)}
          className="h-4 w-4 accent-primary"
        />
      ),
    },
    {
      key: 'reference',
      header: 'Claim ID',
      className: 'px-5 py-5 font-semibold text-dark font-inter',
      render: (claim) => claim.reference_number || claim.id,
    },
    {
      key: 'student',
      header: 'Student',
      className: 'px-5 py-5 text-dark font-inter',
      render: (claim) => claim.student,
    },
    {
      key: 'module',
      header: 'Module',
      className: 'px-5 py-5 text-dark font-inter',
      render: (claim) => claim.module,
    },
    {
      key: 'hours',
      header: 'Hours',
      className: 'px-5 py-5 text-dark font-inter',
      render: (claim) => claim.hours,
    },
    {
      key: 'rate',
      header: 'Rate',
      className: 'px-5 py-5 text-dark font-inter',
      render: (claim) => formatCurrency(claim.rate),
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'px-5 py-5 font-semibold text-dark font-inter',
      render: (claim) => formatCurrency(claim.amount),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'px-5 py-5',
      render: (claim) => <StatusBadge status={claim.status} />,
    },
    {
      key: 'date',
      header: 'Date',
      className: 'px-5 py-5 text-sm text-neutral font-inter',
      render: (claim) => formatDate(claim.date),
    },
  ];

  return (
    <>

          {/* Page Content */}
          <div className={embedded ? '' : 'p-8'}>

            {!embedded && (
              <PageHeader
                title="Payment Export"
                description="Review verified claims and export remuneration information for payment processing."
              />
            )}

            <Section title="Filter Claims">
              <Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Search */}
                  <div>
                    <label className="block text-sm text-neutral mb-2 font-inter font-medium">
                      Search
                    </label>

                    <input
                      type="text"
                      placeholder="Claim, student or module"
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                      className="w-full h-11 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 font-inter"
                    />
                  </div>

                  {/* Date From */}
                  <div>
                    <label className="block text-sm text-neutral mb-2 font-inter font-medium">
                      Date From
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(event) => setDateFrom(event.target.value)}
                      className="w-full h-11 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 font-inter"
                    />
                  </div>

                  {/* Date To */}
                  <div>
                    <label className="block text-sm text-neutral mb-2 font-inter font-medium">
                      Date To
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(event) => setDateTo(event.target.value)}
                      className="w-full h-11 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 font-inter"
                    />
                  </div>

                </div>

              </Card>

            </Section>

            {/* Approved Claims */}
            <Section
              title="Approved Claims"
              actions={
                <span className="text-sm text-neutral font-inter">
                  {selectedClaims.length} selected
                </span>
              }
            >
              <Card>
                <DataTable
                  columns={claimColumns}
                  rows={filteredClaims}
                  getRowKey={(claim) => claim.id}
                  loading={loading}
                  emptyTitle="No approved claims found"
                  emptyDescription="No approved claims match your filters."
                  headerClassName="px-5 py-4 text-left text-sm font-semibold text-neutral font-inter"
                  minWidth="1000px"
                />
              </Card>

            </Section>

            {/* Payment Export Summary */}
            <Section title="Payment Export Summary">
              <Card>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                  <div>
                    <p className="text-sm text-neutral font-inter">
                      Selected Claims
                    </p>

                    <p className="text-xl font-poppins font-semibold text-dark mt-1">
                      {selectedClaims.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral font-inter">
                      Total Hours
                    </p>

                    <p className="text-xl font-poppins font-semibold text-dark mt-1">
                      {totalHours}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral font-inter">
                      Total Remuneration
                    </p>

                    <p className="text-xl font-poppins font-semibold text-primary mt-1">
                      {formatCurrency(totalPayment)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral font-inter">
                      Export Period
                    </p>

                    <p className="text-xl font-poppins font-semibold text-dark mt-1">
                      {exportPeriod}
                    </p>
                  </div>

                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">

                  <Button unstyled
                    onClick={exportPDF}
                    disabled={exporting || loading || selectedClaims.length === 0}
                    className="px-6 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary-lightest transition font-inter"
                  >
                    {exporting ? 'Exporting...' : 'Export PDF'}
                  </Button>

                  <Button unstyled
                    onClick={exportExcel}
                    disabled={loading || selectedClaims.length === 0}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                  >
                    Export CSV
                  </Button>

                </div>

              </Card>

            </Section>

            <Toast
              tone="error"
              message={error}
              onDismiss={() => setError('')}
            />

          </div>

    </>
  );
};

export default ExportPayments;