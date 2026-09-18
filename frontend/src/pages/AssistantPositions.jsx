import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const AssistantPositions = () => {
  const navigate = useNavigate();

  const [positions, setPositions] = useState([
    {
      id: 1,
      moduleCode: 'CMPG311',
      moduleName: 'Databases',
      title: 'Assistant Marker',
      responsibilities: 'Marking / assessment assistance',
      maxHours: 40,
      hourlyRate: 45,
      status: 'Open',
      dateCreated: '2026-09-01',
    },
    {
      id: 2,
      moduleCode: 'CMPG312',
      moduleName: 'Operating Systems',
      title: 'Tutorial Assistant',
      responsibilities: 'Tutorial assistance',
      maxHours: 30,
      hourlyRate: 45,
      status: 'Open',
      dateCreated: '2026-09-03',
    },
    {
      id: 3,
      moduleCode: 'CMPG311',
      moduleName: 'Databases',
      title: 'Lab Assistant',
      responsibilities: 'Laboratory assistance',
      maxHours: 20,
      hourlyRate: 45,
      status: 'Closed',
      dateCreated: '2026-08-20',
    },
  ]);

  const modules = [
    { code: 'CMPG311', name: 'Databases' },
    { code: 'CMPG312', name: 'Operating Systems' },
    { code: 'CMPG313', name: 'Computer Networks' },
    { code: 'CMPG314', name: 'Software Engineering' },
  ];

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

  const emptyForm = {
    moduleCode: '',
    title: '',
    responsibilities: '',
    maxHours: '',
    hourlyRate: '',
  };

  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const formatAmount = (amount) =>
    `R ${Number(amount).toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
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
      moduleCode: position.moduleCode,
      title: position.title,
      responsibilities: position.responsibilities,
      maxHours: position.maxHours,
      hourlyRate: position.hourlyRate,
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
      !formData.moduleCode ||
      !formData.title.trim() ||
      !formData.responsibilities ||
      !formData.maxHours ||
      !formData.hourlyRate
    ) {
      setError('Please complete all fields before saving the Assistant position.');
      return;
    }

    if (Number(formData.maxHours) <= 0) {
      setError('Maximum hours must be greater than zero.');
      return;
    }

    if (Number(formData.hourlyRate) <= 0) {
      setError('Hourly rate must be greater than zero.');
      return;
    }

    const module = modules.find((m) => m.code === formData.moduleCode);

    if (editingId) {
      setPositions((current) =>
        current.map((position) =>
          position.id === editingId
            ? {
                ...position,
                moduleCode: formData.moduleCode,
                moduleName: module?.name || '',
                title: formData.title.trim(),
                responsibilities: formData.responsibilities,
                maxHours: Number(formData.maxHours),
                hourlyRate: Number(formData.hourlyRate),
              }
            : position
        )
      );
    } else {
      const newPosition = {
        id: Date.now(),
        moduleCode: formData.moduleCode,
        moduleName: module?.name || '',
        title: formData.title.trim(),
        responsibilities: formData.responsibilities,
        maxHours: Number(formData.maxHours),
        hourlyRate: Number(formData.hourlyRate),
        status: 'Open',
        dateCreated: new Date().toISOString().slice(0, 10),
      };

      setPositions((current) => [newPosition, ...current]);
    }

    handleCancel();
  };

  const handleToggleStatus = (id) => {
    setPositions((current) =>
      current.map((position) =>
        position.id === id
          ? {
              ...position,
              status: position.status === 'Open' ? 'Closed' : 'Open',
            }
          : position
      )
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this Assistant position?')) return;
    setPositions((current) => current.filter((p) => p.id !== id));
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
                  Create and manage Assistant opportunities for your modules.
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
                    {editingId ? 'Edit Assistant Position' : 'Create Assistant Position'}
                  </h2>

                  <p className="mt-1 text-sm text-neutral">
                    Define the position details, hour allocation and rate for
                    this Assistant opportunity.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="moduleCode"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Module
                      </label>

                      <select
                        id="moduleCode"
                        name="moduleCode"
                        value={formData.moduleCode}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select a module</option>
                        {modules.map((module) => (
                          <option key={module.code} value={module.code}>
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
                        <option value="">Select responsibilities</option>
                        {responsibilityOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
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
                        value={formData.maxHours}
                        onChange={handleChange}
                        placeholder="e.g. 40"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
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
                        min="1"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        placeholder="e.g. 45"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark"
                    >
                      {editingId ? 'Save Changes' : 'Create Position'}
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
                    Create your first Assistant position to make it available to
                    students.
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
                          Created
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
                            {formatAmount(position.hourlyRate)}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {formatDate(position.dateCreated)}
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={position.status} />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(position)}
                                className="font-medium text-primary transition hover:text-primary-dark"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(position.id)}
                                className="font-medium text-primary transition hover:text-primary-dark"
                              >
                                {position.status === 'Open' ? 'Close' : 'Reopen'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(position.id)}
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

export default AssistantPositions;