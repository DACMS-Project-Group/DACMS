import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { apiGet, apiPost } from '../api';

const CreateBudget = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    module: '',
    lecturer: '',
    academicYear: '',
    allocatedAmount: '',
    currentUsage: '0',
    maxHours: '',
  });

  const [modules, setModules] = useState([]);
  const [lecturerList, setLecturerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadBudgetOptions = async () => {
      try {
        setLoading(true);
        setError('');

        const [modulesResponse, lecturersResponse] = await Promise.all([
          apiGet('/admin/modules'),
          apiGet('/admin/lecturers'),
        ]);

        setModules(
          Array.isArray(modulesResponse)
            ? modulesResponse
            : modulesResponse?.data || []
        );

        setLecturerList(
          Array.isArray(lecturersResponse)
            ? lecturersResponse
            : lecturersResponse?.data || []
        );
      } catch (err) {
        console.error('Failed to load budget options:', err);
        setError(err.message || 'Failed to load modules and lecturers.');
      } finally {
        setLoading(false);
      }
    };

    loadBudgetOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError('');

      if (!formData.module) {
        throw new Error('Module is required.');
      }

      if (!formData.lecturer) {
        throw new Error('Lecturer is required.');
      }

      if (!formData.academicYear) {
        throw new Error('Academic year is required.');
      }

      if (!formData.allocatedAmount) {
        throw new Error('Allocated amount is required.');
      }

      if (!formData.maxHours) {
        throw new Error('Max hours is required.');
      }

      const budgetData = {
        module_id: Number(formData.module),
        lecturer_id: Number(formData.lecturer),
        allocated_budget: Number(formData.allocatedAmount),
        current_budget_usage: Number(formData.currentUsage || 0),
        max_allowable_work_hours: Number(formData.maxHours),
        academic_year: Number(formData.academicYear),
      };

      await apiPost('/admin/budgets/create', budgetData);

      navigate('/budget-management');
    } catch (err) {
      console.error('Failed to create budget:', err);
      setError(err.message || 'Failed to create budget.');
    } finally {
      setSubmitting(false);
    }
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

            {error && (
              <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-700 rounded-xl font-inter">
                {error}
              </div>
            )}

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
                        disabled={loading || submitting}
                        className="w-full h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
                      >
                        <option value="">
                          {loading ? 'Loading Modules...' : 'Select Module'}
                        </option>

                        {modules.map((module) => (
                          <option
                            key={module.module_id}
                            value={module.module_id}
                          >
                            {module.module_code} - {module.module_name}
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
                        disabled={loading || submitting}
                        className="w-full h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
                      >
                        <option value="">
                          {loading ? 'Loading Lecturers...' : 'Select Lecturer'}
                        </option>

                        {lecturerList.map((lecturer) => (
                          <option
                            key={lecturer.lecturer_id}
                            value={lecturer.lecturer_id}
                          >
                            {lecturer.name} - {lecturer.email}
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

                      <input
                        id="academicYear"
                        type="number"
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        required
                        disabled={loading || submitting}
                        placeholder="Enter academic year"
                        className="w-full h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
                      />
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
                          disabled={loading || submitting}
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
                          disabled={loading || submitting}
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
                        disabled={loading || submitting}
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
                  disabled={submitting || loading}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                >
                  {submitting ? 'Creating...' : 'Create Budget'}
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