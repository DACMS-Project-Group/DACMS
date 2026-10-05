import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { apiGet, apiPut } from '../api';

const EditBudget = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    moduleId: '',
    moduleCode: '',
    moduleName: '',
    lecturerId: '',
    allocatedBudget: '',
    currentUsage: '',
    maxHours: '',
    year: String(currentYear),
  });

  const [modules, setModules] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        setLoading(true);
        setError('');

        const [budgetResponse, modulesResponse, lecturersResponse] =
          await Promise.all([
            apiGet(`/admin/budgets/fetch/${id}`),
            apiGet('/admin/modules'),
            apiGet('/admin/lecturers'),
          ]);

        const budget = budgetResponse?.data?.[0];

        if (!budget) {
          throw new Error('Budget not found.');
        }

        setModules(
          Array.isArray(modulesResponse)
            ? modulesResponse
            : modulesResponse?.data || []
        );

        setLecturers(
          Array.isArray(lecturersResponse)
            ? lecturersResponse
            : lecturersResponse?.data || []
        );

        setFormData({
          moduleId: budget.module_id ?? '',
          moduleCode: budget.module_code ?? '',
          moduleName:
            budget.module_name ??
            budget.module_description ??
            '',
          lecturerId: budget.lecturer_id ?? '',
          allocatedBudget: budget.allocated_budget ?? '',
          currentUsage: budget.current_budget_usage ?? '0',
          maxHours: budget.max_allowable_work_hours ?? '',
          year: String(budget.academic_year ?? currentYear),
        });
      } catch (err) {
        console.error('Failed to load budget:', err);
        setError(err.message || 'Failed to load budget information.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBudgetData();
    }
  }, [id, currentYear]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError('');
    setSuccess('');

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleModuleChange = (e) => {
    const moduleId = e.target.value;

    const selectedModule = modules.find(
      (module) =>
        String(module.module_id) === String(moduleId)
    );

    setError('');
    setSuccess('');

    setFormData({
      ...formData,
      moduleId,
      moduleCode: selectedModule?.module_code || '',
      moduleName:
        selectedModule?.module_name ||
        selectedModule?.description ||
        '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      if (!formData.moduleId) {
        throw new Error('Module is required.');
      }

      if (!formData.lecturerId) {
        throw new Error('Lecturer is required.');
      }

      if (formData.allocatedBudget === '') {
        throw new Error('Allocated budget is required.');
      }

      if (formData.maxHours === '') {
        throw new Error('Max hours is required.');
      }

      if (formData.year === '') {
        throw new Error('Budget year is required.');
      }

      if (Number(formData.year) < currentYear) {
        throw new Error(
          `Budget year cannot be earlier than ${currentYear}.`
        );
      }

      const updateData = {
        module_id: Number(formData.moduleId),
        lecturer_id: Number(formData.lecturerId),
        allocated_budget: Number(formData.allocatedBudget),
        current_budget_usage: Number(formData.currentUsage || 0),
        max_allowable_work_hours: Number(formData.maxHours),
        academic_year: Number(formData.year),
      };

      await apiPut(
        `/admin/budgets/edit/${id}`,
        updateData
      );

      setSuccess('Budget updated successfully.');
    } catch (err) {
      console.error('Failed to update budget:', err);
      setError(err.message || 'Failed to update budget.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedLecturer = lecturers.find(
    (lecturer) =>
      String(lecturer.lecturer_id) ===
      String(formData.lecturerId)
  );

  return (
    <div className="min-h-screen bg-off-white">

      <Navbar />

      <div className="flex">

        <Sidebar userRole="admin" />

        <main className="flex-1">

          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Edit Budget
            </h1>
          </div>

          {/* Page Content */}
          <div className="p-8">

            {/* Page Introduction */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                Edit Budget Information
              </h2>

              <p className="text-neutral mt-2 font-inter">
                Update the budget allocation and lecturer information.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-700 rounded-xl font-inter">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-6 p-4 border border-green-300 bg-green-50 text-green-700 rounded-xl font-inter">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Budget Information */}
              <section className="mb-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">

                  <h3 className="text-2xl font-poppins font-semibold text-primary">
                    Budget Information
                  </h3>

                  <span className="text-sm text-neutral font-inter">
                    Budget ID: {id}
                  </span>

                </div>

                <Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Module Code */}
                    <div>
                      <label
                        htmlFor="moduleCode"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Module Code
                      </label>

                      <input
                        id="moduleCode"
                        type="text"
                        value={
                          loading
                            ? 'Loading...'
                            : formData.moduleCode
                        }
                        readOnly
                        className="w-full h-12 px-4 border border-neutral rounded-xl bg-primary-lightest font-inter"
                      />
                    </div>

                    {/* Module Name */}
                    <div>
                      <label
                        htmlFor="moduleName"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Module Name
                      </label>

                      <input
                        id="moduleName"
                        type="text"
                        value={
                          loading
                            ? 'Loading...'
                            : formData.moduleName
                        }
                        readOnly
                        className="w-full h-12 px-4 border border-neutral rounded-xl bg-primary-lightest font-inter"
                      />
                    </div>

                    {/* Allocated Budget */}
                    <div>
                      <label
                        htmlFor="allocatedBudget"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Allocated Budget
                      </label>

                      <div className="flex">

                        <span className="flex items-center px-4 bg-primary-lightest border border-r-0 border-neutral rounded-l-xl font-inter text-primary font-semibold">
                          R
                        </span>

                        <input
                          id="allocatedBudget"
                          type="number"
                          name="allocatedBudget"
                          value={formData.allocatedBudget}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          required
                          disabled={loading || submitting}
                          className="w-full h-12 px-4 border border-neutral rounded-r-xl focus:outline-none focus:border-primary font-inter"
                        />

                      </div>
                    </div>

                    {/* Budget Year */}
                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Budget Year
                      </label>

                      <input
                        id="year"
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        min={currentYear}
                        max="2100"
                        step="1"
                        required
                        disabled={loading || submitting}
                        className="w-full h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
                      />

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

              {/* Lecturer Allocation */}
              <section className="mb-8">

                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Lecturer Allocation
                </h3>

                <Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Lecturer */}
                    <select
                      id="lecturer"
                      value={formData.lecturerId}
                      onChange={(e) => {
                        setError('');
                        setSuccess('');

                        setFormData({
                          ...formData,
                          lecturerId: e.target.value,
                        });
                      }}
                      required
                      disabled={loading || submitting}
                      className="h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
                    >
                      <option value="">
                        {loading
                          ? 'Loading Lecturers...'
                          : 'Select Lecturer'}
                      </option>

                      {lecturers.map((lecturer) => (
                        <option
                          key={lecturer.lecturer_id}
                          value={lecturer.lecturer_id}
                        >
                          {lecturer.name} - {lecturer.email}
                        </option>
                      ))}
                    </select>

                    {/* Allocation */}
                    <div className="flex">

                      <span className="flex items-center px-4 bg-primary-lightest border border-r-0 border-neutral rounded-l-xl font-inter text-primary font-semibold">
                        R
                      </span>

                      <input
                        type="number"
                        placeholder="Allocation Amount"
                        value={formData.allocatedBudget}
                        onChange={(e) => {
                          setError('');
                          setSuccess('');

                          setFormData({
                            ...formData,
                            allocatedBudget: e.target.value,
                          });
                        }}
                        min="0"
                        step="0.01"
                        disabled={loading || submitting}
                        className="w-full h-12 px-4 border border-neutral rounded-r-xl focus:outline-none focus:border-primary font-inter"
                      />

                    </div>

                    {/* Add Lecturer */}
                    <button
                      type="button"
                      disabled
                      className="h-12 px-6 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary-lightest transition font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + Add Lecturer
                    </button>

                  </div>

                  {/* Lecturer Table */}
                  <div className="mt-6 overflow-x-auto">

                    <table className="w-full">

                      <thead className="bg-primary-lightest">
                        <tr>

                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Lecturer
                          </th>

                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Allocation
                          </th>

                          <th className="p-4 text-right text-sm font-semibold text-primary font-inter">
                            Action
                          </th>

                        </tr>
                      </thead>

                      <tbody>

                        {!loading && selectedLecturer && (
                          <tr
                            className="border-t border-neutral/30 hover:bg-primary-lightest/30 transition"
                          >

                            <td className="p-4 text-dark font-inter">
                              {selectedLecturer.name}
                            </td>

                            <td className="p-4 text-dark font-inter">
                              R{' '}
                              {Number(
                                formData.allocatedBudget || 0
                              ).toLocaleString('en-ZA')}
                            </td>

                            <td className="p-4 text-right">

                              <button
                                type="button"
                                disabled
                                className="text-red-600 font-semibold hover:underline font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Remove
                              </button>

                            </td>

                          </tr>
                        )}

                        {!loading && !selectedLecturer && (
                          <tr>
                            <td
                              colSpan="3"
                              className="p-4 text-center text-neutral font-inter"
                            >
                              No lecturer assigned.
                            </td>
                          </tr>
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* Total Allocation */}
                  <div className="flex justify-end mt-6 pt-6 border-t border-neutral/30">

                    <div className="text-right">

                      <p className="text-sm text-neutral font-inter">
                        Total Lecturer Allocation
                      </p>

                      <p className="text-2xl font-poppins font-bold text-primary mt-1">
                        R{' '}
                        {Number(
                          formData.allocatedBudget || 0
                        ).toLocaleString('en-ZA')}
                      </p>

                    </div>

                  </div>

                </Card>

              </section>

              {/* Form Actions */}
              <div className="flex justify-end gap-4">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/budget-management/details/${id}`
                    )
                  }
                  disabled={submitting}
                  className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-lightest transition font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || submitting}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>

              </div>

            </form>

          </div>

        </main>

      </div>

    </div>
  );
};

export default EditBudget;