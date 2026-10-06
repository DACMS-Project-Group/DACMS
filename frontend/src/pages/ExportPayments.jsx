import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

const ExportPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Approved');
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
    const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;

    return matchesSearch
      && matchesStatus
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

  const formatCurrency = (amount) =>
    `R ${Number(amount).toLocaleString('en-ZA')}`;

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
    : '—';
  const formatDate = (value) => new Date(value).toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-off-white">

      <Navbar />

      <div className="flex">

        <Sidebar userRole="admin" />

        <main className="flex-1">

          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Export Payments
            </h1>
          </div>

          {/* Page Content */}
          <div className="p-8">

            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                Payment Export
              </h2>

              <p className="text-neutral mt-2 font-inter">
                Review approved claims and export remuneration
                information for payment processing.
              </p>
            </div>

            {/* Filters */}
            <section className="mb-8">

              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Filter Claims
              </h3>

              <Card>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

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

                  {/* Status */}
                  <div>
                    <label className="block text-sm text-neutral mb-2 font-inter font-medium">
                      Status
                    </label>

                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      className="w-full h-11 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 font-inter"
                    >
                      <option>Approved</option>
                      <option>Paid</option>
                      <option>All</option>
                    </select>
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

            </section>

            {/* Summary Statistics */}
            <section className="mb-8">

              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Payment Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Approved Claims
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {claims.length}
                  </p>
                </Card>

                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Selected Claims
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {selectedClaims.length}
                  </p>
                </Card>

                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Total Hours
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {totalHours}
                  </p>
                </Card>

                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Total Payment
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {formatCurrency(totalPayment)}
                  </p>
                </Card>

              </div>

            </section>

            {/* Approved Claims */}
            <section className="mb-8">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">

                <h3 className="text-2xl font-poppins font-semibold text-primary">
                  Approved Claims
                </h3>

                <span className="text-sm text-neutral font-inter">
                  {selectedClaims.length} selected
                </span>

              </div>

              <Card>

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead className="bg-primary-lightest">

                      <tr>

                        <th className="px-5 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={
                              filteredClaims.length > 0 &&
                              filteredClaims.every((claim) =>
                                selectedClaims.includes(claim.id)
                              )
                            }
                            onChange={toggleAll}
                            className="w-4 h-4 accent-primary"
                          />
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-neutral font-inter">
                          Claim ID
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-neutral font-inter">
                          Student
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-neutral font-inter">
                          Module
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-neutral font-inter">
                          Hours
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-neutral font-inter">
                          Rate
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-neutral font-inter">
                          Amount
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-neutral font-inter">
                          Status
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-neutral font-inter">
                          Date
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredClaims.map((claim) => (

                        <tr
                          key={claim.id}
                          className="border-t border-neutral/30 hover:bg-primary-lightest/30 transition"
                        >

                          <td className="px-5 py-5">

                            <input
                              type="checkbox"
                              checked={selectedClaims.includes(
                                claim.id
                              )}
                              onChange={() =>
                                toggleClaim(claim.id)
                              }
                              className="w-4 h-4 accent-primary"
                            />

                          </td>

                          <td className="px-5 py-5 font-semibold text-dark font-inter">
                            {claim.reference_number || claim.id}
                          </td>

                          <td className="px-5 py-5 text-dark font-inter">
                            {claim.student}
                          </td>

                          <td className="px-5 py-5 text-dark font-inter">
                            {claim.module}
                          </td>

                          <td className="px-5 py-5 text-dark font-inter">
                            {claim.hours}
                          </td>

                          <td className="px-5 py-5 text-dark font-inter">
                            {formatCurrency(claim.rate)}
                          </td>

                          <td className="px-5 py-5 font-semibold text-dark font-inter">
                            {formatCurrency(claim.amount)}
                          </td>

                          <td className="px-5 py-5">
                            <StatusBadge status={claim.status} />
                          </td>

                          <td className="px-5 py-5 text-sm text-neutral font-inter">
                            {formatDate(claim.date)}
                          </td>

                        </tr>

                      ))}

                      {filteredClaims.length === 0 && (

                        <tr>

                          <td
                            colSpan="9"
                            className="px-5 py-10 text-center text-neutral font-inter"
                          >
                            {loading
                              ? 'Loading approved claims...'
                              : 'No approved claims found matching your filters.'}
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </Card>

            </section>

            {/* Payment Export Summary */}
            <section>

              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Payment Export Summary
              </h3>

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

                  <button
                    onClick={exportPDF}
                    disabled={exporting || loading || selectedClaims.length === 0}
                    className="px-6 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary-lightest transition font-inter"
                  >
                    {exporting ? 'Exporting...' : 'Export PDF'}
                  </button>

                  <button
                    onClick={exportExcel}
                    disabled={loading || selectedClaims.length === 0}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                  >
                    Export CSV
                  </button>

                </div>

              </Card>

            </section>

            {error && (
              <p role="alert" className="mt-4 text-sm text-error font-inter">
                {error}
              </p>
            )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default ExportPayments;