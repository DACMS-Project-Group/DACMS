import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const ExportPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClaims, setSelectedClaims] = useState([]);

  const claims = [
    {
      id: 'CLM-001',
      student: 'Student Example',
      module: 'CMPG323',
      hours: 20,
      rate: 150,
      amount: 3000,
      status: 'Approved',
      date: '28 Aug 2026',
    },
    {
      id: 'CLM-002',
      student: 'Student Example',
      module: 'CMPG321',
      hours: 15,
      rate: 150,
      amount: 2250,
      status: 'Approved',
      date: '29 Aug 2026',
    },
    {
      id: 'CLM-003',
      student: 'Student Example',
      module: 'CMPG323',
      hours: 18,
      rate: 150,
      amount: 2700,
      status: 'Approved',
      date: '30 Aug 2026',
    },
    {
      id: 'CLM-004',
      student: 'Student Example',
      module: 'CMPG315',
      hours: 22,
      rate: 150,
      amount: 3300,
      status: 'Approved',
      date: '31 Aug 2026',
    },
    {
      id: 'CLM-005',
      student: 'Student Example',
      module: 'CMPG323',
      hours: 16,
      rate: 150,
      amount: 2400,
      status: 'Approved',
      date: '31 Aug 2026',
    },
  ];

  const filteredClaims = claims.filter(
    (claim) =>
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleClaim = (id) => {
    if (selectedClaims.includes(id)) {
      setSelectedClaims(
        selectedClaims.filter((claimId) => claimId !== id)
      );
    } else {
      setSelectedClaims([...selectedClaims, id]);
    }
  };

  const toggleAll = () => {
    if (selectedClaims.length === filteredClaims.length) {
      setSelectedClaims([]);
    } else {
      setSelectedClaims(
        filteredClaims.map((claim) => claim.id)
      );
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
    `R ${amount.toLocaleString('en-ZA')}`;

  const exportExcel = () => {
    if (selectedClaims.length === 0) {
      alert('Please select at least one claim.');
      return;
    }

    alert(
      `Exporting ${selectedClaims.length} claims to Excel.`
    );
  };

  const exportPDF = () => {
    if (selectedClaims.length === 0) {
      alert('Please select at least one claim.');
      return;
    }

    alert(
      `Exporting ${selectedClaims.length} claims to PDF.`
    );
  };

  return (
    <div className="flex min-h-screen bg-off-white">

      {/* Sidebar */}
      <Sidebar userRole="admin" />

      {/* Main Content */}
      <div className="flex-1">

        {/* Top Navbar */}
        <Navbar />

        {/* Page Title */}
        <div className="bg-primary h-16 flex items-center px-8">
          <h1 className="text-3xl font-poppins font-bold text-white">
            Export Payments
          </h1>
        </div>

        {/* Page Content */}
        <main className="p-8">

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
                    className="
                      w-full
                      h-11
                      px-4
                      border
                      border-neutral
                      rounded-xl
                      focus:outline-none
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/25
                      font-inter
                    "
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-neutral mb-2 font-inter font-medium">
                    Status
                  </label>

                  <select
                    className="
                      w-full
                      h-11
                      px-4
                      border
                      border-neutral
                      rounded-xl
                      focus:outline-none
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/25
                      font-inter
                    "
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
                    className="
                      w-full
                      h-11
                      px-4
                      border
                      border-neutral
                      rounded-xl
                      focus:outline-none
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/25
                      font-inter
                    "
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm text-neutral mb-2 font-inter font-medium">
                    Date To
                  </label>

                  <input
                    type="date"
                    className="
                      w-full
                      h-11
                      px-4
                      border
                      border-neutral
                      rounded-xl
                      focus:outline-none
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/25
                      font-inter
                    "
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

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-primary-lightest">

                    <tr>

                      <th className="px-5 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedClaims.length ===
                              filteredClaims.length &&
                            filteredClaims.length > 0
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
                        className="
                          border-t
                          border-neutral/30
                          hover:bg-primary-lightest/30
                          transition
                        "
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
                          {claim.id}
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
                          {claim.date}
                        </td>

                      </tr>

                    ))}

                    {filteredClaims.length === 0 && (

                      <tr>

                        <td
                          colSpan="9"
                          className="px-5 py-10 text-center text-neutral font-inter"
                        >
                          No approved claims found matching your search.
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

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
                    August 2026
                  </p>
                </div>

              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">

                <button
                  onClick={exportPDF}
                  className="
                    px-6
                    py-3
                    border-2
                    border-primary
                    text-primary
                    rounded-xl
                    font-semibold
                    hover:bg-primary-lightest
                    transition
                    font-inter
                  "
                >
                  Export PDF
                </button>

                <button
                  onClick={exportExcel}
                  className="
                    px-6
                    py-3
                    bg-primary
                    text-white
                    rounded-xl
                    font-semibold
                    hover:bg-primary-dark
                    transition
                    font-inter
                  "
                >
                  Export Excel
                </button>

              </div>

            </Card>

          </section>

        </main>

      </div>

    </div>
  );
};

export default ExportPayments;
