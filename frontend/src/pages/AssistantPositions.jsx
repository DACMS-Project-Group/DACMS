import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

const AssistantPositions = () => {
  // Assistant positions start empty.

  const [positions, setPositions] = useState([]);

  // Real budget information from the backend.
  const [budgets, setBudgets] = useState([]);
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [budgetError, setBudgetError] = useState('');

  const emptyForm = {
    moduleId: '',
    moduleCode: '',
    moduleName: '',
    title: '',
    responsibilities: '',
    maxHours: '',
    hourlyRate: '',
  };

  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const responsibilityOptions = [
    'Tutorial assistance',
    'Student consultation',
    'Practical assistance',
    'Assignment assistance',
    'Laboratory assistance',
    'Marking / assessment assistance',
    'Administrative assistance',
    'Other',
  ];

  /*
   * Fetch the lecturer's budget information.
   *
   * Existing backend endpoint:
   * GET /api/lecturer/budgets
   */
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setLoadingBudgets(true);
        setBudgetError('');

        const data = await apiGet('/lecturer/budgets');

        setBudgets(data?.budgets || []);
      } catch (err) {
        console.error('Error loading lecturer budgets:', err);

        setBudgetError(
          err.message ||
            'Unable to load your module budget information.'
        );
      } finally {
        setLoadingBudgets(false);
      }
    };

    loadBudgets();
  }, []);

  /*
   * Convert the backend budget information into
   * module information used by the form.
   *
   * The backend should provide:
   * module_id
   * module_code
   * module_name
   * max_allowable_work_hours
   */
  const modules = budgets.map((budget) => ({
    id: budget.module_id,
    code: budget.module_code,
    name:
      budget.module_name ||
      budget.module_description ||
      budget.module_code,
    maxHours: Number(budget.max_allowable_work_hours || 0),
    allocatedBudget: Number(budget.allocated_budget || 0),
    currentUsage: Number(budget.current_budget_usage || 0),
    remainingBudget: Number(budget.remaining_budget || 0),
  }));

  const formatAmount = (amount) =>
    `R ${Number(amount || 0).toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'moduleId') {
      const selectedModule = modules.find(
        (module) => String(module.id) === String(value)
      );

      setFormData((previous) => ({
        ...previous,
        moduleId: value,
        moduleCode: selectedModule?.code || '',
        moduleName: selectedModule?.name || '',
        maxHours: selectedModule?.maxHours || '',
      }));

      setError('');
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  const handleOpenCreate = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const handleOpenEdit = (position) => {
    setFormData({
      moduleId: position.moduleId,
      moduleCode: position.moduleCode,
      moduleName: position.moduleName,
      title: position.title,
      responsibilities: position.responsibilities,
      maxHours: position.maxHours,
      hourlyRate: position.hourlyRate || '',
    });

    setEditingId(position.id);
    setError('');
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError('');
    setShowForm(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setError('');

    if (
      !formData.moduleId ||
      !formData.title.trim() ||
      !formData.responsibilities ||
      !formData.maxHours
    ) {
      setError(
        'Please complete all required fields before saving the Assistant position.'
      );
      return;
    }

    const selectedModule = modules.find(
      (module) =>
        String(module.id) === String(formData.moduleId)
    );

    if (!selectedModule) {
      setError('Please select a valid module.');
      return;
    }

    const requestedHours = Number(formData.maxHours);
    const availableHours = Number(selectedModule.maxHours);

    if (requestedHours <= 0) {
      setError('Maximum hours must be greater than zero.');
      return;
    }

    if (availableHours <= 0) {
      setError(
        'This module does not currently have available work hours in its budget.'
      );
      return;
    }

    if (requestedHours > availableHours) {
      setError(
        `Maximum hours cannot exceed the ${availableHours} hours allocated to this module.`
      );
      return;
    }

    if (editingId) {
      setPositions((current) =>
        current.map((position) =>
          position.id === editingId
            ? {
                ...position,
                moduleId: selectedModule.id,
                moduleCode: selectedModule.code,
                moduleName: selectedModule.name,
                title: formData.title.trim(),
                responsibilities: formData.responsibilities,
                maxHours: requestedHours,
                hourlyRate: formData.hourlyRate,
              }
            : position
        )
      );
    } else {
      const newPosition = {
        id: Date.now(),
        moduleId: selectedModule.id,
        moduleCode: selectedModule.code,
        moduleName: selectedModule.name,
        title: formData.title.trim(),
        responsibilities: formData.responsibilities,
        maxHours: requestedHours,
        hourlyRate: formData.hourlyRate,
        status: 'Open',
        dateCreated: new Date().toISOString().slice(0, 10),
      };

      setPositions((current) => [
        ...current,
        newPosition,
      ]);
    }

    handleCancel();
  };

  const handleToggleStatus = (id) => {
    setPositions((current) =>
      current.map((position) =>
        position.id === id
          ? {
              ...position,
              status:
                position.status === 'Open'
                  ? 'Closed'
                  : 'Open',
            }
          : position
      )
    );
  };

  const handleDelete = (id) => {
    if (
      !window.confirm(
        'Delete this Assistant position?'
      )
    ) {
      return;
    }

    setPositions((current) =>
      current.filter(
        (position) => position.id !== id
      )
    );
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="lecturer" />

        <main className="flex-1">
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Assistant Position Management
            </h1>
          </div>

          <div className="p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-primary-dark">
                  Assistant Positions
                </h2>

                <p className="mt-2 text-neutral">
                  Create and manage Assistant opportunities
                  for your modules.
                </p>
              </div>

              {!showForm && (
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark"
                >
                  Create Position
                </button>
              )}
            </div>

            {showForm && (
              <Card className="mb-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-primary-dark">
                    {editingId
                      ? 'Edit Assistant Position'
                      : 'Create Assistant Position'}
                  </h2>

                  <p className="mt-1 text-sm text-neutral">
                    Define the position details and hour
                    allocation for this Assistant opportunity.
                  </p>
                </div>

                {budgetError && (
                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {budgetError}
                  </div>
                )}

                {error && (
                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="moduleId"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Module
                      </label>

                      <select
                        id="moduleId"
                        name="moduleId"
                        value={formData.moduleId}
                        onChange={handleChange}
                        disabled={loadingBudgets}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                      >
                        <option value="">
                          {loadingBudgets
                            ? 'Loading modules...'
                            : 'Select a module'}
                        </option>

                        {modules.map((module) => (
                          <option
                            key={module.id}
                            value={module.id}
                          >
                            {module.code} - {module.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="title"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Position Title
                      </label>

                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Tutorial Assistant"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="responsibilities"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Responsibilities
                      </label>

                      <select
                        id="responsibilities"
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        <option value="">
                          Select responsibilities
                        </option>

                        {responsibilityOptions.map(
                          (option) => (
                            <option
                              key={option}
                              value={option}
                            >
                              {option}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="maxHours"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Maximum Hours
                      </label>

                      <input
                        id="maxHours"
                        name="maxHours"
                        type="number"
                        min="1"
                        max={
                          formData.moduleId
                            ? modules.find(
                                (module) =>
                                  String(module.id) ===
                                  String(
                                    formData.moduleId
                                  )
                              )?.maxHours
                            : undefined
                        }
                        value={formData.maxHours}
                        onChange={handleChange}
                        placeholder="Select a module first"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />

                      {formData.moduleId && (
                        <p className="mt-2 text-xs text-neutral">
                          Maximum available hours:{' '}
                          {selectedModuleMaxHours(
                            modules,
                            formData.moduleId
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="hourlyRate"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Hourly Rate (R)
                      </label>

                      <input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        placeholder="Payment scale rate"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />

                      <p className="mt-2 text-xs text-neutral">
                        The hourly rate should come from the
                        applicable payment scale.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark"
                    >
                      {editingId
                        ? 'Save Changes'
                        : 'Create Position'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Card>
            )}

            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Your Assistant Positions
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Positions you have created for your modules.
                </p>
              </div>

              {positions.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-medium text-gray-700">
                    No Assistant Positions Yet
                  </p>

                  <p className="mt-1 text-sm text-neutral">
                    Create your first Assistant position to
                    make it available to students.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-light-grey text-left">
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Module
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Position
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Responsibilities
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Max Hours
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Rate
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Status
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {positions.map((position) => (
                        <tr
                          key={position.id}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-primary-dark">
                            {position.moduleCode}
                            <span className="block text-xs font-normal text-neutral">
                              {position.moduleName}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {position.title}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {position.responsibilities}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {position.maxHours} hrs
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {position.hourlyRate
                              ? formatAmount(
                                  position.hourlyRate
                                )
                              : 'Not set'}
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge
                              status={position.status}
                            />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenEdit(
                                    position
                                  )
                                }
                                className="font-medium text-primary transition hover:text-primary-dark"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleStatus(
                                    position.id
                                  )
                                }
                                className="font-medium text-primary transition hover:text-primary-dark"
                              >
                                {position.status ===
                                'Open'
                                  ? 'Close'
                                  : 'Reopen'}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    position.id
                                  )
                                }
                                className="font-medium text-red-600 transition hover:text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

const selectedModuleMaxHours = (modules, moduleId) => {
  const selectedModule = modules.find(
    (module) =>
      String(module.id) === String(moduleId)
  );

  return selectedModule?.maxHours ?? 0;
};

export default AssistantPositions;
