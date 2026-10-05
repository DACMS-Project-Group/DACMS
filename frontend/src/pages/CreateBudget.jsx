import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { apiGet, apiPost } from '../api';

const CreateBudget = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    module: '',
    lecturer: '',
    academicYear: '',
    allocatedAmount: '',
    currentUsage: '',
    maxHours: '',
  });

  const [modules, setModules] = useState([]);
  const [lecturerList, setLecturerList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [lecturerLoading, setLecturerLoading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load modules
  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        setError('');

        const modulesResponse = await apiGet('/admin/modules');

        setModules(
          Array.isArray(modulesResponse)
            ? modulesResponse
            : modulesResponse?.data || []
        );
      } catch (err) {
        console.error('Failed to load modules:', err);
        setError(err.message || 'Failed to load modules.');
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  // Load lecturers when a module is selected
  useEffect(() => {
    const loadLecturers = async () => {
      if (!formData.module) {
        setLecturerList([]);
        return;
      }

      try {
        setLecturerLoading(true);
        setError('');

        const lecturersResponse = await apiGet(
          `/admin/modules/${formData.module}/lecturers`
        );

        setLecturerList(lecturersResponse?.lecturers || []);
      } catch (err) {
        console.error('Failed to load lecturers:', err);
        setLecturerList([]);
        setError(err.message || 'Failed to load lecturers.');
      } finally {
        setLecturerLoading(false);
      }
    };

    loadLecturers();
  }, [formData.module]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setError('');
    setSuccess('');

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'module' ? { lecturer: '' } : {}),
    }));
  };

  // Submit budget
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!formData.module) {
      setError('Please select a module.');
      return;
    }

    if (!formData.lecturer) {
      setError('Please select a lecturer.');
      return;
    }

    if (!formData.academicYear) {
      setError('Please enter the academic year.');
      return;
    }

    if (Number(formData.academicYear) < currentYear) {
      setError(`Academic year cannot be earlier than ${currentYear}.`);
      return;
    }

    if (!formData.allocatedAmount) {
      setError('Please enter the allocated budget.');
      return;
    }

    if (!formData.maxHours) {
      setError('Please enter the maximum allowable work hours.');
      return;
    }

    try {
      setSubmitting(true);

      const budgetData = {
        module_id: Number(formData.module),
        lecturer_id: Number(formData.lecturer),
        allocated_budget: Number(formData.allocatedAmount),
        current_budget_usage: Number(formData.currentUsage || 0),
        max_allowable_work_hours: Number(formData.maxHours),
        academic_year: Number(formData.academicYear),
      };

      await apiPost('/admin/budgets/create', budgetData);

      setSuccess('Budget created successfully.');

      setFormData({
        module: '',
        lecturer: '',
        academicYear: '',
        allocatedAmount: '',
        currentUsage: '',
        maxHours: '',
      });

      setLecturerList([]);
    } catch (err) {
      console.error('Failed to create budget:', err);
      setError(err.message || 'Failed to create budget.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      {/* FULL-WIDTH HEADER */}
      <Navbar />

      {/* PAGE BODY */}
      <div className="flex min-h-[calc(100vh-64px)]">

        {/* SIDEBAR */}
        <Sidebar userRole="admin" />

        {/* MAIN CONTENT */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">

          {/* PAGE HEADER */}
          <div className="bg-[#6C3D91] px-8 py-5">
            <h1 className="text-2xl font-semibold text-white">
              Create New Budget
            </h1>
          </div>

          {/* CONTENT */}
          <main className="flex flex-1 px-8 py-8">

            {/* BUDGET INFORMATION CARD */}
            <Card className="flex w-full flex-1 flex-col">

              {/* Card Header */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800">
                  Budget Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create a budget and assign it to a lecturer for the
                  selected module.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* Loading */}
              {loading ? (
                <div className="flex flex-1 items-center justify-center py-12">
                  <p className="text-gray-500">
                    Loading modules...
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-1 flex-col"
                >

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* Module */}
                    <div>
                      <label
                        htmlFor="module"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Module
                      </label>

                      <select
                        id="module"
                        name="module"
                        value={formData.module}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-[#6C3D91] focus:outline-none focus:ring-1 focus:ring-[#6C3D91]"
                      >
                        <option value="">
                          Select a module
                        </option>

                        {modules.map((module) => (
                          <option
                            key={
                              module.module_id ??
                              module.ModuleID
                            }
                            value={
                              module.module_id ??
                              module.ModuleID
                            }
                          >
                            {module.module_code ??
                              module.ModuleCode ??
                              module.module_name ??
                              module.ModuleName ??
                              module.Description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Lecturer */}
                    <div>
                      <label
                        htmlFor="lecturer"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Lecturer
                      </label>

                      <select
                        id="lecturer"
                        name="lecturer"
                        value={formData.lecturer}
                        onChange={handleChange}
                        disabled={
                          !formData.module ||
                          lecturerLoading
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-[#6C3D91] focus:outline-none focus:ring-1 focus:ring-[#6C3D91] disabled:cursor-not-allowed disabled:bg-gray-100"
                      >
                        <option value="">
                          {!formData.module
                            ? 'Select a module first'
                            : lecturerLoading
                              ? 'Loading lecturers...'
                              : lecturerList.length === 0
                                ? 'No lecturers available'
                                : 'Select a lecturer'}
                        </option>

                        {lecturerList.map((lecturer) => (
                          <option
                            key={lecturer.lecturer_id}
                            value={lecturer.lecturer_id}
                          >
                            {lecturer.lecturer}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Academic Year */}
                    <div>
                      <label
                        htmlFor="academicYear"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Academic Year
                      </label>

                      <input
                        id="academicYear"
                        type="number"
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleChange}
                        placeholder={`e.g. ${currentYear}`}
                        min={currentYear}
                        max="2100"
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-[#6C3D91] focus:outline-none focus:ring-1 focus:ring-[#6C3D91]"
                      />
                    </div>

                    {/* Allocated Budget */}
                    <div>
                      <label
                        htmlFor="allocatedAmount"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Allocated Budget
                      </label>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                          R
                        </span>

                        <input
                          id="allocatedAmount"
                          type="number"
                          name="allocatedAmount"
                          value={formData.allocatedAmount}
                          onChange={handleChange}
                          placeholder="50000"
                          min="0"
                          step="0.01"
                          required
                          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-9 pr-4 text-gray-700 focus:border-[#6C3D91] focus:outline-none focus:ring-1 focus:ring-[#6C3D91]"
                        />
                      </div>
                    </div>

                    {/* Current Budget Usage */}
                    <div>
                      <label
                        htmlFor="currentUsage"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Current Budget Usage
                      </label>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
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
                          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-9 pr-4 text-gray-700 focus:border-[#6C3D91] focus:outline-none focus:ring-1 focus:ring-[#6C3D91]"
                        />
                      </div>
                    </div>

                    {/* Maximum Allowable Work Hours */}
                    <div>
                      <label
                        htmlFor="maxHours"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Maximum Allowable Work Hours
                      </label>

                      <input
                        id="maxHours"
                        type="number"
                        name="maxHours"
                        value={formData.maxHours}
                        onChange={handleChange}
                        placeholder="e.g. 100"
                        min="0"
                        step="0.01"
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-[#6C3D91] focus:outline-none focus:ring-1 focus:ring-[#6C3D91]"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex justify-end gap-3 border-t border-gray-200 pt-6">
                    <button
                      type="button"
                      onClick={() =>
                        navigate('/budget-management')
                      }
                      disabled={submitting}
                      className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-lg bg-[#6C3D91] px-6 py-3 font-medium text-white transition hover:bg-[#5A3280] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting
                        ? 'Creating...'
                        : 'Create Budget'}
                    </button>
                  </div>

                </form>
              )}

            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateBudget;