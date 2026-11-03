import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../ui/Button';
import FormField, { inputClass } from '../ui/FormField';
import Toast from '../ui/Toast';
import { apiGet, apiPost } from '../api';

const CreateBudget = () => {
  document.title = 'AACMS - Create Budget';
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
    <>
      {/* PAGE HEADER */}
      <div className="bg-primary px-8 py-5">
        <h1 className="text-2xl font-poppins font-semibold text-white">
          Create New Budget
        </h1>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 px-8 py-8">

            {/* BUDGET INFORMATION CARD */}
            <Card className="flex w-full flex-1 flex-col">

              {/* Card Header */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-dark">
                  Budget Information
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Create a budget and assign it to a lecturer for the
                  selected module.
                </p>
              </div>

              <Toast
                tone="error"
                message={error}
                onDismiss={() => setError('')}
              />

              <Toast
                tone="success"
                message={success}
                onDismiss={() => setSuccess('')}
              />

              {/* Loading */}
              {loading ? (
                <div className="flex flex-1 items-center justify-center py-12">
                  <p className="text-neutral">
                    Loading modules...
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-1 flex-col"
                >

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    <FormField id="module" label="Module" required>
                      <select
                        id="module"
                        name="module"
                        value={formData.module}
                        onChange={handleChange}
                        required
                        className={inputClass}
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
                    </FormField>

                    <FormField id="lecturer" label="Lecturer" required>
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
                        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-light-grey`}
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
                    </FormField>

                    <FormField
                      id="academicYear"
                      label="Academic Year"
                      required
                    >
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
                        className={inputClass}
                      />
                    </FormField>

                    <FormField
                      id="allocatedAmount"
                      label="Allocated Budget"
                      required
                    >
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral">
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
                          className={`${inputClass} pl-9`}
                        />
                      </div>
                    </FormField>

                    <FormField
                      id="currentUsage"
                      label="Current Budget Usage"
                    >
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral">
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
                          className={`${inputClass} pl-9`}
                        />
                      </div>
                    </FormField>

                    <FormField
                      id="maxHours"
                      label="Maximum Allowable Work Hours"
                      required
                    >
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
                        className={inputClass}
                      />
                    </FormField>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex justify-end gap-3 border-t border-border-subtle pt-6">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        navigate('/budget-management')
                      }
                      disabled={submitting}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" disabled={submitting}>
                      {submitting
                        ? 'Creating...'
                        : 'Create Budget'}
                    </Button>
                  </div>

                </form>
              )}

            </Card>
      </div>
    </>
  );
};

export default CreateBudget;