import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const CreateBudget = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    module: '',
    lecturer: '',
    academicYear: '2026',
    allocatedAmount: '',
    currentUsage: '',
    maxHours: '',
  });

  const modules = [
    {
      code: 'CMPG321',
      name: 'Advanced Databases',
    },
    {
      code: 'CMPG323',
      name: 'Software Engineering',
    },
    {
      code: 'CMPG315',
      name: 'Programming',
    },
    {
      code: 'CMPG311',
      name: 'Systems Analysis',
    },
  ];

  const lecturerList = [
    'Dr John Example',
    'Prof Jane Example',
    'Dr Michael Example',
    'Ms Sarah Example',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('New Budget:', formData);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="admin" />

        <main className="flex-1 p-8">
          <div className="bg-[#6C3D91] text-white px-8 py-5 rounded-t-lg">
            <h1 className="text-3xl font-bold">
              Create Budget
            </h1>
          </div>

          <div className="bg-white p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6C3D91]">
                Budget Information
              </h2>

              <p className="text-[#78848E] mt-1">
                Create a new module budget and allocate funding.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="border border-[#78848E] rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-[#6C3D91] mb-6">
                  Budget Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Module */}
                  <div>
                    <label className="block text-sm font-medium text-[#78848E] mb-2">
                      Module
                    </label>

                    <select
                      name="module"
                      value={formData.module}
                      onChange={handleChange}
                      required
                      className="w-full h-12 px-4 border border-[#78848E] rounded-xl focus:outline-none focus:border-[#6C3D91]"
                    >
                      <option value="">
                        Select Module
                      </option>

                      {modules.map((module) => (
                        <option
                          key={module.code}
                          value={module.code}
                        >
                          {module.code} - {module.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lecturer */}
                  <div>
                    <label className="block text-sm font-medium text-[#78848E] mb-2">
                      Lecturer
                    </label>

                    <select
                      name="lecturer"
                      value={formData.lecturer}
                      onChange={handleChange}
                      required
                      className="w-full h-12 px-4 border border-[#78848E] rounded-xl focus:outline-none focus:border-[#6C3D91]"
                    >
                      <option value="">
                        Select Lecturer
                      </option>

                      {lecturerList.map((lecturer) => (
                        <option
                          key={lecturer}
                          value={lecturer}
                        >
                          {lecturer}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Academic Year */}
                  <div>
                    <label className="block text-sm font-medium text-[#78848E] mb-2">
                      Academic Year
                    </label>

                    <select
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      required
                      className="w-full h-12 px-4 border border-[#78848E] rounded-xl focus:outline-none focus:border-[#6C3D91]"
                    >
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>

                  {/* Allocated Amount */}
                  <div>
                    <label className="block text-sm font-medium text-[#78848E] mb-2">
                      Allocated Amount
                    </label>

                    <div className="flex">
                      <span className="flex items-center px-4 bg-[#F3F4F6] border border-r-0 border-[#78848E] rounded-l-xl">
                        R
                      </span>

                      <input
                        type="number"
                        name="allocatedAmount"
                        value={formData.allocatedAmount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                        className="w-full h-12 px-4 border border-[#78848E] rounded-r-xl focus:outline-none focus:border-[#6C3D91]"
                      />
                    </div>
                  </div>

                  {/* Current Usage */}
                  <div>
                    <label className="block text-sm font-medium text-[#78848E] mb-2">
                      Current Usage
                    </label>

                    <div className="flex">
                      <span className="flex items-center px-4 bg-[#F3F4F6] border border-r-0 border-[#78848E] rounded-l-xl">
                        R
                      </span>

                      <input
                        type="number"
                        name="currentUsage"
                        value={formData.currentUsage}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                        className="w-full h-12 px-4 border border-[#78848E] rounded-r-xl focus:outline-none focus:border-[#6C3D91]"
                      />
                    </div>
                  </div>

                  {/* Max Hours */}
                  <div>
                    <label className="block text-sm font-medium text-[#78848E] mb-2">
                      Max Hours
                    </label>

                    <input
                      type="number"
                      name="maxHours"
                      value={formData.maxHours}
                      onChange={handleChange}
                      min="0"
                      step="0.5"
                      required
                      className="w-full h-12 px-4 border border-[#78848E] rounded-xl focus:outline-none focus:border-[#6C3D91]"
                    />
                  </div>

                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">

                <button
                  type="button"
                  onClick={() => navigate('/budget-management')}
                  className="h-11 px-6 border border-[#78848E] rounded-xl font-semibold hover:bg-[#F3F4F6]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-11 px-6 bg-[#6C3D91] text-white rounded-xl font-semibold hover:bg-[#5A3280]"
                >
                  Create Budget
                </button>

              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateBudget;