import React from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';


const Dashboard = () => {
  // Sample data (same as before)
  const overviewData = [
    { module: 'CMPG xxx', hours: 20, earnings: 'R 100,00', pending: 1 },
    { module: 'CMPG xxx', hours: 15, earnings: 'R 75,00', pending: 0 },
  ];

  const applications = [
    { module: 'CMPG xxx', date: '15 August 2026', status: 'Approved' },
    { module: 'CMPG xxx', date: '10 August 2026', status: 'Pending' },
    { module: 'XXXX 211', date: '19 July 2026', status: 'Rejected' },
  ];

  const claims = [
    { module: 'CMPG xxx', amount: 'R 750', status: 'Approved', claimNo: 'C 001' },
    { module: 'CMPG xxx', amount: 'R 3000', status: 'Pending', claimNo: 'C 002' },
  ];

  const recentActivity = [
    { text: 'Application for CMPG xxx', time: 'Today 14:22' },
    { text: 'Uploaded supporting documents', time: 'Yesterday 14:22' },
    { text: 'Added hours worked', time: 'Yesterday 14:22' },
  ];

  return (
    <div className="flex min-h-screen bg-off-white">
      
      {/* ===== SIDEBAR ===== */}
      <Sidebar userRole="student" />
      
      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1">
        
        {/* Page Title Bar */}
        <div className="bg-primary h-16 flex items-center px-8">
          <h1 className="text-4xl font-poppins font-bold text-white">Dashboard</h1>
        </div>

        {/* Main Content */}
        <div className="p-8">
          
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-poppins font-semibold text-primary">Welcome Name!</h2>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            <Card>
              <h3 className="text-2xl font-poppins font-semibold text-dark mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition text-center">
                  Start work session
                </button>
                <button className="bg-primary-lightest text-dark px-6 py-3 rounded-xl font-semibold hover:bg-primary-light hover:text-white transition text-center">
                  Apply to Demi
                </button>
                <button className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-lightest transition text-center">
                  Submit Claim
                </button>
              </div>
            </Card>

            <Card>
              <h3 className="text-2xl font-poppins font-semibold text-dark mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="border-b border-neutral pb-3">
                  <p className="font-semibold text-dark">Your application was successful!</p>
                  <p className="text-sm text-neutral">Today 14:22</p>
                </div>
                <div className="border-b border-neutral pb-3">
                  <p className="font-semibold text-dark">Please update your details!</p>
                  <p className="text-sm text-neutral">Yesterday 14:22</p>
                </div>
                <div>
                  <p className="font-semibold text-dark">Notification!</p>
                  <p className="text-sm text-neutral">Yesterday 14:22</p>
                </div>
                <a href="#" className="text-primary font-semibold hover:underline block text-right">
                  View all →
                </a>
              </div>
            </Card>
          </div>

          {/* Overview Table */}
          <div className="mb-8">
            <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">Overview</h3>
            <Card className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-light-grey">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral">Modules</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral">Hours worked</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral">Earnings</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral">Pending claims</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewData.map((row, index) => (
                    <tr key={index} className="border-b border-neutral last:border-0">
                      <td className="py-3 px-4 text-dark">{row.module}</td>
                      <td className="py-3 px-4 text-dark">{row.hours}</td>
                      <td className="py-3 px-4 text-dark">{row.earnings}</td>
                      <td className="py-3 px-4 text-dark">{row.pending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Application Status & Claims */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            <div>
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">Application Status</h3>
              <Card className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-light-grey">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral">Module</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, index) => (
                      <tr key={index} className="border-b border-neutral last:border-0">
                        <td className="py-3 px-4 text-dark">{app.module}</td>
                        <td className="py-3 px-4 text-dark">{app.date}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <a href="#" className="text-primary font-semibold hover:underline block text-right mt-4">
                  View all →
                </a>
              </Card>
            </div>

            <div>
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">Claims</h3>
              <Card className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-light-grey">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral">Module</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral">Claim #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim, index) => (
                      <tr key={index} className="border-b border-neutral last:border-0">
                        <td className="py-3 px-4 text-dark">{claim.module}</td>
                        <td className="py-3 px-4 text-dark">{claim.amount}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={claim.status} />
                        </td>
                        <td className="py-3 px-4 text-dark">{claim.claimNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <a href="#" className="text-primary font-semibold hover:underline block text-right mt-4">
                  View all →
                </a>
              </Card>
            </div>
          </div>

          {/* Generate Claim & Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">Generate Claim</h3>
              <Card>
                <p className="text-neutral mb-4">Ready to submit a new claim?</p>
                <button className="w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition">
                  Generate New Claim
                </button>
              </Card>
            </div>

            <div>
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">Recent Activity</h3>
              <Card>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className={`${index < recentActivity.length - 1 ? 'border-b border-neutral pb-3' : ''}`}>
                      <p className="font-semibold text-dark">{activity.text}</p>
                      <p className="text-sm text-neutral">{activity.time}</p>
                    </div>
                  ))}
                </div>
                <a href="#" className="text-primary font-semibold hover:underline block text-right mt-4">
                  View all →
                </a>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;