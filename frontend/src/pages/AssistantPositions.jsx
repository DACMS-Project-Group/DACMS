import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { apiGet, apiPost, apiPatch } from '../api';

const AssistantPositions = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [formData, setFormData] = useState({
    moduleId: '',
    deadline: '',
    minimumGrade: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // ---- Load listings on mount ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/lecturer/listings');

        const list = Array.isArray(data) ? data : data?.listings || [];

        if (!cancelled) {
          setListings(list);
          setLoadError('');
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Field mapping (defensive: backend may use PascalCase or snake_case) ----
  const mapListing = (raw) => ({
    id: raw.ListingID ?? raw.listing_id ?? raw.id,
    moduleId: raw.ModuleID ?? raw.module_id ?? raw.moduleId,
    moduleCode:
      raw.ModuleCode ?? raw.module_code ?? raw.moduleCode ?? null,
    moduleName:
      raw.ModuleName ?? raw.module_name ?? raw.moduleName ?? null,
    lecturerId: raw.LecturerID ?? raw.lecturer_id ?? raw.lecturerId,
    deadline: raw.Deadline ?? raw.deadline,
    minimumGrade: raw.MinimumGrade ?? raw.minimum_grade ?? raw.minimumGrade,
  });

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleOpenCreate = () => {
    setFormData({ moduleId: '', deadline: '', minimumGrade: '' });
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };

  const handleOpenEdit = (listing) => {
    setFormData({
      moduleId: listing.moduleId ?? '',
      deadline: listing.deadline
        ? new Date(listing.deadline).toISOString().slice(0, 10)
        : '',
      minimumGrade: listing.minimumGrade ?? '',
    });
    setEditingId(listing.id);
    setFormError('');
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ moduleId: '', deadline: '', minimumGrade: '' });
    setEditingId(null);
    setFormError('');
    setShowForm(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!formData.moduleId || !formData.deadline || !formData.minimumGrade) {
      setFormError('Please complete all fields before saving the listing.');
      return;
    }

    if (Number(formData.minimumGrade) < 0 || Number(formData.minimumGrade) > 100) {
      setFormError('Minimum grade must be between 0 and 100.');
      return;
    }

    const payload = {
      moduleId: Number(formData.moduleId),
      deadline: formData.deadline,
      minimumGrade: Number(formData.minimumGrade),
    };

    try {
      setSaving(true);

      if (editingId) {
        const updated = await apiPatch(
          `/lecturer/listings/edit/${editingId}`,
          payload
        );
        const mapped = mapListing(updated || payload);

        setListings((current) =>
          current.map((l) => (l.id === editingId ? { ...l, ...mapped } : l))
        );
      } else {
        const created = await apiPost('/lecturer/listings/create', payload);
        const mapped = mapListing(created || payload);

        setListings((current) => [mapped, ...current]);
      }

      handleCancel();
    } catch (err) {
      setFormError(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="lecturer" />

        <main className="flex-1">
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Assistant Listings
            </h1>
          </div>

          <div className="p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-primary-dark">
                  Assistant Listings
                </h2>

                <p className="mt-2 text-neutral">
                  Create and manage Assistant openings for your modules.
                </p>

                {loadError && (
                  <p className="mt-2 text-sm text-error font-inter">
                    Could not load listings: {loadError}
                  </p>
                )}
              </div>

              {!showForm && (
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark"
                >
                  Create Listing
                </button>
              )}
            </div>

            {showForm && (
              <Card className="mb-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-primary-dark">
                    {editingId ? 'Edit Listing' : 'Create Listing'}
                  </h2>

                  <p className="mt-1 text-sm text-neutral">
                    Define the module, application deadline and minimum grade
                    for this Assistant opening.
                  </p>
                </div>

                {formError && (
                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div>
                      <label
                        htmlFor="moduleId"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Module ID
                      </label>

                      <input
                        id="moduleId"
                        name="moduleId"
                        type="number"
                        min="1"
                        value={formData.moduleId}
                        onChange={handleChange}
                        placeholder="e.g. 2"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="deadline"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Application Deadline
                      </label>

                      <input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="minimumGrade"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Minimum Grade (%)
                      </label>

                      <input
                        id="minimumGrade"
                        name="minimumGrade"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.minimumGrade}
                        onChange={handleChange}
                        placeholder="e.g. 60"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving
                        ? 'Saving…'
                        : editingId
                          ? 'Save Changes'
                          : 'Create Listing'}
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
                  Your Listings
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Openings you have created for your modules.
                </p>
              </div>

              {loading ? (
                <p className="py-10 text-center text-neutral font-inter">
                  Loading listings…
                </p>
              ) : listings.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-medium text-gray-700">
                    No Listings Yet
                  </p>

                  <p className="mt-1 text-sm text-neutral">
                    Create your first listing to make it available to students.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-light-grey text-left">
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Listing ID
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Module
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Deadline
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Minimum Grade
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {listings.map((raw) => {
                        const listing = mapListing(raw);

                        return (
                          <tr
                            key={listing.id}
                            className="border-b border-gray-100 last:border-b-0"
                          >
                            <td className="px-4 py-4 text-sm font-medium text-primary-dark">
                              #{listing.id}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                              {listing.moduleCode
                                ? `${listing.moduleCode}${listing.moduleName ? ` — ${listing.moduleName}` : ''}`
                                : `Module #${listing.moduleId ?? '—'}`}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                              {formatDate(listing.deadline)}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                              {listing.minimumGrade != null
                                ? `${listing.minimumGrade}%`
                                : '—'}
                            </td>

                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(listing)}
                                className="font-medium text-primary transition hover:text-primary-dark"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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