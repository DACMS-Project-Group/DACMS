import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import FormField, { inputClass } from '../ui/FormField';
import PageHeader from '../ui/PageHeader';
import Toast from '../ui/Toast';
import { formatMoney } from '../lib/format';
import { apiGet, apiPost, apiPut } from '../api';

const emptyForm = {
  module: '',
  lecturer: '',
  academicYear: '',
  allocatedAmount: '',
  currentUsage: '',
  maxHours: '',
  moduleCode: '',
  moduleName: '',
  lecturerName: '',
  lecturerEmail: '',
};

const getModuleId = (module) =>
  module?.module_id ?? module?.moduleId ?? module?.id ?? '';

const getModuleCode = (module) =>
  module?.module_code ?? module?.moduleCode ?? module?.code ?? '';

const getModuleName = (module) =>
  module?.module_name ??
  module?.ModuleName ??
  module?.description ??
  module?.module_description ??
  '';

const BudgetForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  document.title = `AACMS - ${isEdit ? 'Edit' : 'Create'} Budget`;

  const [formData, setFormData] = useState(emptyForm);
  const [modules, setModules] = useState([]);
  const [lecturerList, setLecturerList] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [lecturerLoading, setLecturerLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load modules, plus the budget being edited.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setPageLoading(true);
        setLoadError('');

        const modulesResponse = await apiGet('/admin/modules');
        const moduleList = Array.isArray(modulesResponse)
          ? modulesResponse
          : modulesResponse?.data || [];

        if (cancelled) return;
        setModules(moduleList);

        if (!isEdit) return;

        const budgetResponse = await apiGet(`/admin/budgets/fetch/${id}`);
        const budget =
          budgetResponse?.data?.[0] ??
          budgetResponse?.data ??
          budgetResponse;

        if (!budget) {
          throw new Error('Budget not found.');
        }

        const selectedModule = moduleList.find(
          (module) =>
            String(getModuleCode(module)).trim().toUpperCase() ===
            String(budget.module_code ?? '').trim().toUpperCase()
        );

        if (cancelled) return;

        setFormData({
          module: String(getModuleId(selectedModule) || ''),
          lecturer: String(budget.lecturer_id ?? ''),
          academicYear: String(budget.academic_year ?? currentYear),
          allocatedAmount: String(budget.allocated_budget ?? ''),
          currentUsage: String(budget.current_budget_usage ?? '0'),
          maxHours: String(budget.max_allowable_work_hours ?? ''),
          moduleCode: budget.module_code ?? '',
          moduleName: budget.module_description ?? '',
          lecturerName: budget.lecturer ?? '',
          lecturerEmail: budget.lecturer_email ?? '',
        });
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err.message || 'Failed to load budget information.'
          );
        }
      } finally {
        if (!cancelled) {
          setPageLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, isEdit, currentYear]);

  // Load available lecturers for the selected module when creating.
  useEffect(() => {
    if (isEdit || !formData.module) {
      setLecturerList([]);
      return undefined;
    }

    let cancelled = false;

    const loadLecturers = async () => {
      try {
        setLecturerLoading(true);

        const response = await apiGet(
          `/admin/modules/${formData.module}/lecturers`
        );

        if (!cancelled) {
          setLecturerList(response?.lecturers || []);
        }
      } catch {
        if (!cancelled) {
          setLecturerList([]);
        }
      } finally {
        if (!cancelled) {
          setLecturerLoading(false);
        }
      }
    };

    loadLecturers();

    return () => {
      cancelled = true;
    };
  }, [formData.module, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setError('');
    setSuccess('');

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'module' ? { lecturer: '' } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    let moduleId = formData.module;

    if (!moduleId && formData.moduleCode) {
      const selectedModule = modules.find(
        (module) =>
          String(getModuleCode(module)).trim().toUpperCase() ===
          String(formData.moduleCode).trim().toUpperCase()
      );
      moduleId = getModuleId(selectedModule);
    }

    if (!moduleId) {
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

    if (formData.allocatedAmount === '') {
      setError('Please enter the allocated budget.');
      return;
    }

    if (formData.maxHours === '') {
      setError('Please enter the maximum allowable work hours.');
      return;
    }

    const budgetData = {
      module_id: Number(moduleId),
      lecturer_id: Number(formData.lecturer),
      allocated_budget: Number(formData.allocatedAmount),
      current_budget_usage: Number(formData.currentUsage || 0),
      max_allowable_work_hours: Number(formData.maxHours),
      academic_year: Number(formData.academicYear),
    };

    try {
      setSubmitting(true);

      if (isEdit) {
        await apiPut(`/admin/budgets/edit/${id}`, budgetData);
        setSuccess('Budget updated successfully.');
      } else {
        await apiPost('/admin/budgets/create', budgetData);
        setSuccess('Budget created successfully.');
        setFormData(emptyForm);
        setLecturerList([]);
      }
    } catch (err) {
      setError(
        err.message ||
          (isEdit ? 'Failed to update budget.' : 'Failed to create budget.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedLecturer = formData.lecturer
    ? {
        id: formData.lecturer,
        name: formData.lecturerName,
        email: formData.lecturerEmail,
      }
    : null;

  const lecturerColumns = [
    {
      key: 'lecturer',
      header: 'Lecturer',
      className: 'p-4 text-dark font-inter',
      render: (lecturer) => (
        <div>
          <div className="font-medium">{lecturer.name}</div>
          <div className="text-sm text-neutral">{lecturer.email}</div>
        </div>
      ),
    },
    {
      key: 'allocation',
      header: 'Allocation',
      className: 'p-4 text-dark font-inter',
      render: () => formatMoney(formData.allocatedAmount || 0),
    },
    {
      key: 'action',
      header: 'Action',
      headerClassName:
        'p-4 text-right text-sm font-semibold text-primary font-inter',
      className: 'p-4 text-right',
      render: () => (
        <Button
          unstyled
          type="button"
          disabled
          className="text-error font-semibold hover:underline font-inter disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Remove
        </Button>
      ),
    },
  ];

  const errorMessage = loadError || error;

  return (
    <>
      <div className="p-4 md:p-8">
        {isEdit && (
          <Button
            unstyled
            type="button"
            onClick={() => navigate('/budget-management')}
            className="mb-6 flex items-center gap-2 font-semibold text-primary transition hover:text-primary-dark font-inter"
          >
            <span className="text-2xl leading-none">←</span>
            <span>Back to Budget Management</span>
          </Button>
        )}

        <PageHeader
          title={isEdit ? 'Edit Budget' : 'Create New Budget'}
          description={
            isEdit
              ? 'Update the budget allocation and lecturer information.'
              : 'Create a budget and assign it to a lecturer for the selected module.'
          }
        />

        <Toast
          tone="error"
          message={errorMessage}
          onDismiss={() => {
            setLoadError('');
            setError('');
          }}
        />

        <Toast
          tone="success"
          message={success}
          onDismiss={() => setSuccess('')}
        />

        {pageLoading ? (
          <Card>
            <p className="py-8 text-center text-neutral font-inter">
              Loading budget...
            </p>
          </Card>
        ) : loadError && isEdit ? (
          <Card>
            <div className="py-8 text-center">
              <p className="font-semibold text-error font-inter">
                Could not load budget
              </p>
              <p className="mt-1 text-sm text-neutral font-inter">
                {loadError}
              </p>
              <Button
                className="mt-6"
                onClick={() => navigate('/budget-management')}
              >
                Back to Budget Management
              </Button>
            </div>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <div className="mb-6">
                <h2 className="text-section font-semibold text-primary-dark">
                  Budget Information
                </h2>

                {isEdit && (
                  <p className="mt-1 text-sm text-neutral font-inter">
                    Budget ID: {id}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  id="module"
                  label="Module"
                  required={!isEdit}
                >
                  {isEdit ? (
                    <input
                      id="module"
                      type="text"
                      value={`${formData.moduleCode}${
                        formData.moduleName
                          ? ` - ${formData.moduleName}`
                          : ''
                      }`}
                      readOnly
                      className={`${inputClass} bg-primary-lightest`}
                    />
                  ) : (
                    <select
                      id="module"
                      name="module"
                      value={formData.module}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select a module</option>

                      {modules.map((module) => (
                        <option
                          key={getModuleId(module)}
                          value={getModuleId(module)}
                        >
                          {getModuleCode(module) || getModuleName(module)}
                        </option>
                      ))}
                    </select>
                  )}
                </FormField>

                <FormField
                  id="lecturer"
                  label="Lecturer"
                  required={!isEdit}
                >
                  {isEdit ? (
                    <>
                      <input
                        id="lecturer"
                        type="text"
                        value={formData.lecturerName}
                        readOnly
                        className={`${inputClass} bg-primary-lightest`}
                      />

                      {formData.lecturerEmail && (
                        <p className="mt-1 text-xs text-neutral font-inter">
                          {formData.lecturerEmail}
                        </p>
                      )}
                    </>
                  ) : (
                    <select
                      id="lecturer"
                      name="lecturer"
                      value={formData.lecturer}
                      onChange={handleChange}
                      disabled={!formData.module || lecturerLoading}
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
                  )}
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
                    disabled={submitting}
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
                      disabled={submitting}
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
                      disabled={submitting}
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
                    disabled={submitting}
                    className={inputClass}
                  />
                </FormField>
              </div>
            </Card>

            {isEdit && (
              <section>
                <h3 className="mb-4 text-card font-poppins font-semibold text-primary">
                  Lecturer Allocation
                </h3>

                <Card>
                  <DataTable
                    columns={lecturerColumns}
                    rows={selectedLecturer ? [selectedLecturer] : []}
                    getRowKey={(lecturer) => lecturer.email}
                    emptyTitle="No lecturer assigned"
                    minWidth="600px"
                  />

                  <div className="mt-6 flex justify-end border-t border-neutral/30 pt-6">
                    <div className="text-right">
                      <p className="text-sm text-neutral font-inter">
                        Total Lecturer Allocation
                      </p>

                      <p className="mt-1 text-2xl font-poppins font-bold text-primary">
                        {formatMoney(formData.allocatedAmount || 0)}
                      </p>
                    </div>
                  </div>
                </Card>
              </section>
            )}

            <div className="flex justify-end gap-3 border-t border-border-subtle pt-6">
              <Button
                variant="secondary"
                onClick={() => navigate('/budget-management')}
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={submitting}>
                {submitting
                  ? isEdit
                    ? 'Saving...'
                    : 'Creating...'
                  : isEdit
                    ? 'Save Changes'
                    : 'Create Budget'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default BudgetForm;
