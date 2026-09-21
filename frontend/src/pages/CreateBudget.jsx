import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

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
    <div className="min-h-screen bg-off-white">

      <Navbar />

      <div className="flex">

        <Sidebar userRole="admin" />

        <main className="flex-1">

          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Create Budget
            </h1>
          </div>

          {/* Page Content */}
          <div className="p-8">

            {/* Page Introduction */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                Budget Information
              </h2>

              <p className="text-neutral mt-2 font-inter">
                Create a new module budget and allocate funding.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Budget Details */}
              <section className="mb-8">

                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Budget Details
                </h3>

                <Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Module */}
                    <div>
                      <label
                        htmlFor="module"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Module
                      </label>

                      <select
                        id="module"
                        name="module"
                        value={formData.module}
                        onChange={handleChange}
                        required
                        className="w-full h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
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
                      <label
                        htmlFor="lecturer"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Lecturer
                      </label>

                      <select
                        id="lecturer"
                        name="lecturer"
                        value={formData.lecturer}
                        onChange={handleChange}
                        required
                        className="w-full h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
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
                      <label
                        htmlFor="academicYear"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Academic Year
                      </label>

                      <select
                        id="academicYear"
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleChange}
                        required
                        className="w-full h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
                      >
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                      </select>
                    </div>

                    {/* Allocated Amount */}
                    <div>
                      <label
                        htmlFor="allocatedAmount"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Allocated Amount
                      </label>

                      <div className="flex">

                        <span className="flex items-center px-4 bg-primary-lightest border border-r-0 border-neutral rounded-l-xl font-inter text-primary font-semibold">
                          R
                        </span>

                        <input
                          id="allocatedAmount"
                          type="number"
                          name="allocatedAmount"
                          value={formData.allocatedAmount}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          required
                          className="w-full h-12 px-4 border border-neutral rounded-r-xl focus:outline-none focus:border-primary font-inter"
                        />

                      </div>
                    </div>

                    {/* Current Usage */}
                    <div>
                      <label
                        htmlFor="currentUsage"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Current Usage
                      </label>

                      <div className="flex">

                        <span className="flex items-center px-4 bg-primary-lightest border border-r-0 border-neutral rounded-l-xl font-inter text-primary font-semibold">
                          R
                        </span>

                        <input
                          id="currentUsage"
                          type="number"
                          name="currentUsage"
                          value={formData.currentUsage}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          required
                          className="w-full h-12 px-4 border border-neutral rounded-r-xl focus:outline-none focus:border-primary font-inter"
                        />

                      </div>
                    </div>

                    {/* Max Hours */}
                    <div>
                      <label
                        htmlFor="maxHours"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Max Hours
                      </label>

                      <input
                        id="maxHours"
                        type="number"
                        name="maxHours"
                        value={formData.maxHours}
                        onChange={handleChange}
                        min="0"
                        step="0.5"
                        required
                        className="w-full h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
                      />
                    </div>

                  </div>

                </Card>

              </section>

              {/* Form Actions */}
              <div className="flex justify-end gap-4">

                <button
                  type="button"
                  onClick={() => navigate('/budget-management')}
                  className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-lightest transition font-inter"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
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