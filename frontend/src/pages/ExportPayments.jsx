import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const ExportPayments = () => {

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedClaims, setSelectedClaims] =
    useState([]);

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
      claim.id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      claim.student
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      claim.module
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const toggleClaim = (id) => {

    if (selectedClaims.includes(id)) {
      setSelectedClaims(
        selectedClaims.filter(
          (claimId) => claimId !== id
        )
      );
    } else {
      setSelectedClaims([
        ...selectedClaims,
        id,
      ]);
    }
  };

  const toggleAll = () => {

    if (
      selectedClaims.length ===
      filteredClaims.length
    ) {
      setSelectedClaims([]);
    } else {
      setSelectedClaims(
        filteredClaims.map((claim) => claim.id)
      );
    }
  };

  const selectedClaimData = claims.filter(
    (claim) =>
      selectedClaims.includes(claim.id)
  );

  const totalHours = selectedClaimData.reduce(
    (total, claim) =>
      total + claim.hours,
    0
  );

  const totalPayment = selectedClaimData.reduce(
    (total, claim) =>
      total + claim.amount,
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
    <div className="min-h-screen bg-[#F8F9FA]">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-8">

          {/* Page header */}
          <div className="bg-[#6C3D91] text-white px-8 py-5 rounded-t-lg">

            <h1 className="text-3xl font-bold">
              Export Payments
            </h1>

          </div>

          <div className="bg-white p-8">

            <div className="mb-8">

              <h2 className="text-2xl font-semibold text-[#6C3D91]">
                Payment Export
              </h2>

              <p className="text-[#78848E] mt-1">
                Review approved claims and export remuneration
                information for payment processing.
              </p>

            </div>

            {/* Filters */}
            <div className="border border-[#78848E] rounded-xl p-6 mb-8">

              <h3 className="text-lg font-semibold text-[#6C3D91] mb-5">
                Filter Claims
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div>

                  <label className="block text-sm text-[#78848E] mb-2">
                    Search
                  </label>

                  <input
                    type="text"
                    placeholder="Claim, student or module"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    className="w-full h-11 px-4 border border-[#78848E] rounded-xl focus:outline-none focus:border-[#6C3D91]"
                  />

                </div>

                <div>

                  <label className="block text-sm text-[#78848E] mb-2">
                    Status
                  </label>

                  <select className="w-full h-11 px-4 border border-[#78848E] rounded-xl">
                    <option>Approved</option>
                    <option>Paid</option>
                    <option>All</option>
                  </select>

                </div>

                <div>

                  <label className="block text-sm text-[#78848E] mb-2">
                    Date From
                  </label>

                  <input
                    type="date"
                    className="w-full h-11 px-4 border border-[#78848E] rounded-xl"
                  />

                </div>

                <div>

                  <label className="block text-sm text-[#78848E] mb-2">
                    Date To
                  </label>

                  <input
                    type="date"
                    className="w-full h-11 px-4 border border-[#78848E] rounded-xl"
                  />

                </div>

              </div>

            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

              <div className="border border-[#78848E] rounded-xl p-6">

                <p className="text-sm text-[#78848E]">
                  Approved Claims
                </p>

                <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {claims.length}
                </p>

              </div>

              <div className="border border-[#78848E] rounded-xl p-6">

                <p className="text-sm text-[#78848E]">
                  Selected Claims
                </p>

                <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {selectedClaims.length}
                </p>

              </div>

              <div className="border border-[#78848E] rounded-xl p-6">

                <p className="text-sm text-[#78848E]">
                  Total Hours
                </p>

                <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {totalHours}
                </p>

              </div>

              <div className="border border-[#78848E] rounded-xl p-6">

                <p className="text-sm text-[#78848E]">
                  Total Payment
                </p>

                <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {formatCurrency(totalPayment)}
                </p>

              </div>

            </div>

            {/* Claims table */}
            <div className="mb-8">

              <div className="flex justify-between items-center mb-4">

                <h3 className="text-xl font-semibold text-[#6C3D91]">
                  Approved Claims
                </h3>

                <span className="text-sm text-[#78848E]">
                  {selectedClaims.length} selected
                </span>

              </div>

              <div className="border border-[#78848E] rounded-xl overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-[#F3F4F6]">

                    <tr>

                      <th className="p-4 text-left">

                        <input
                          type="checkbox"
                          checked={
                            selectedClaims.length ===
                              filteredClaims.length &&
                            filteredClaims.length > 0
                          }
                          onChange={toggleAll}
                          className="w-4 h-4 accent-[#6C3D91]"
                        />

                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Claim ID
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Student
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Module
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Hours
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Rate
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Amount
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Status
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Date
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredClaims.map(
                      (claim) => (

                        <tr
                          key={claim.id}
                          className="border-t border-[#78848E]/40 hover:bg-[#E8DDF0]/30"
                        >

                          <td className="p-4">

                            <input
                              type="checkbox"
                              checked={selectedClaims.includes(
                                claim.id
                              )}
                              onChange={() =>
                                toggleClaim(
                                  claim.id
                                )
                              }
                              className="w-4 h-4 accent-[#6C3D91]"
                            />

                          </td>

                          <td className="p-4 font-semibold">
                            {claim.id}
                          </td>

                          <td className="p-4">
                            {claim.student}
                          </td>

                          <td className="p-4">
                            {claim.module}
                          </td>

                          <td className="p-4">
                            {claim.hours}
                          </td>

                          <td className="p-4">
                            {formatCurrency(
                              claim.rate
                            )}
                          </td>

                          <td className="p-4 font-semibold">
                            {formatCurrency(
                              claim.amount
                            )}
                          </td>

                          <td className="p-4">

                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              {claim.status}
                            </span>

                          </td>

                          <td className="p-4 text-sm text-[#78848E]">
                            {claim.date}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* Export summary */}
            <div className="border border-[#78848E] rounded-xl p-6 bg-[#F8F9FA]">

              <h3 className="text-lg font-semibold text-[#6C3D91] mb-5">
                Payment Export Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div>
                  <p className="text-sm text-[#78848E]">
                    Selected Claims
                  </p>

                  <p className="font-semibold mt-1">
                    {selectedClaims.length}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#78848E]">
                    Total Hours
                  </p>

                  <p className="font-semibold mt-1">
                    {totalHours}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#78848E]">
                    Total Remuneration
                  </p>

                  <p className="font-semibold mt-1">
                    {formatCurrency(totalPayment)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#78848E]">
                    Export Period
                  </p>

                  <p className="font-semibold mt-1">
                    August 2026
                  </p>
                </div>

              </div>

              <div className="flex justify-end gap-4 mt-8">

                <button
                  onClick={exportPDF}
                  className="h-11 px-6 border-2 border-[#6C3D91] text-[#6C3D91] rounded-xl font-semibold hover:bg-[#E8DDF0]"
                >
                  Export PDF
                </button>

                <button
                  onClick={exportExcel}
                  className="h-11 px-6 bg-[#6C3D91] text-white rounded-xl font-semibold hover:bg-[#5A3280]"
                >
                  Export Excel
                </button>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default ExportPayments;