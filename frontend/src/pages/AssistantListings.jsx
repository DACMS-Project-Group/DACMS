import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import PageHeader from '../ui/PageHeader';
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { apiGet, apiPost, apiPatch } from '../api';


const AssistantListings = () => {
  document.title = 'AACMS - Assistant Listings';
  const [listings, setListings] = useState([]);
  const [modules, setModules] = useState([]);


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


  useEffect(() => {
    let cancelled = false;


    const loadData = async () => {
      try {
        setLoading(true);
        setLoadError('');


        const [listingsData, modulesData] = await Promise.all([
          apiGet('/lecturer/listings'),
          apiGet('/lecturer/modules'),
        ]);


        const listingData = Array.isArray(listingsData)
          ? listingsData
          : listingsData?.listings || [];


        const moduleData = Array.isArray(modulesData)
          ? modulesData
          : modulesData?.modules || [];


        if (!cancelled) {
          setListings(listingData);
          setModules(moduleData);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };


    loadData();


    return () => {
      cancelled = true;
    };
  }, []);


  const getListingId = (raw) =>
    raw.ListingID ?? raw.listing_id ?? raw.id;


  const getModuleId = (raw) =>
    raw.ModuleID ?? raw.module_id ?? raw.moduleId;


  const getModuleCode = (raw) =>
    raw.ModuleCode ??
    raw.module_code ??
    raw.moduleCode ??
    '';


  const getModuleName = (raw) =>
    raw.ModuleName ??
    raw.module_name ??
    raw.moduleName ??
    raw.Description ??
    raw.description ??
    '';


  const getDeadline = (raw) =>
    raw.Deadline ?? raw.deadline ?? '';

  const getDateInputValue = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDeadlineTimestamp = (date) =>
    new Date(`${date}T23:59:59`).toISOString();


  const getMinimumGrade = (raw) =>
    raw.MinimumGrade ??
    raw.minimum_grade ??
    raw.minimumGrade ??
    null;


  const findModule = (moduleId) => {
    return modules.find(
      (module) => String(getModuleId(module)) === String(moduleId)
    );
  };


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


  const mapListing = (raw) => {
    const moduleId = getModuleId(raw);
    const module = findModule(moduleId);


    return {
      id: getListingId(raw),
      moduleId,
      moduleCode:
        getModuleCode(raw) ||
        (module ? getModuleCode(module) : ''),
      moduleName:
        getModuleName(raw) ||
        (module ? getModuleName(module) : ''),
      deadline: getDeadline(raw),
      minimumGrade: getMinimumGrade(raw),
    };
  };


  const handleChange = (event) => {
    const { name, value } = event.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    setFormError('');
  };


  const handleOpenCreate = () => {
    setFormData({
      moduleId: '',
      deadline: '',
      minimumGrade: '',
    });


    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };


  const handleOpenEdit = (listing) => {
    setFormData({
      moduleId: listing.moduleId ?? '',
      deadline: getDateInputValue(listing.deadline),
      minimumGrade:
        listing.minimumGrade !== null &&
        listing.minimumGrade !== undefined
          ? String(listing.minimumGrade)
          : '',
    });


    setEditingId(listing.id);
    setFormError('');
    setShowForm(true);
  };


  const handleCancel = () => {
    setFormData({
      moduleId: '',
      deadline: '',
      minimumGrade: '',
    });


    setEditingId(null);
    setFormError('');
    setShowForm(false);
  };


  const handleSave = async (event) => {
    event.preventDefault();
    setFormError('');


    if (
      !formData.moduleId ||
      !formData.deadline ||
      formData.minimumGrade === ''
    ) {
      setFormError(
        'Please complete all fields before saving the listing.'
      );
      return;
    }


    if (
      Number(formData.minimumGrade) < 0 ||
      Number(formData.minimumGrade) > 100
    ) {
      setFormError('Minimum grade must be between 0 and 100.');
      return;
    }


    const payload = {
      moduleId: Number(formData.moduleId),
      deadline: getDeadlineTimestamp(formData.deadline),
      minimumGrade: Number(formData.minimumGrade),
    };


    try {
      setSaving(true);


      if (editingId) {
        await apiPatch(
          `/lecturer/listings/edit/${editingId}`,
          payload
        );
      } else {
        await apiPost(
          '/lecturer/listings/create',
          payload
        );
      }

      const refreshedListings = await apiGet('/lecturer/listings');
      setListings(
        Array.isArray(refreshedListings)
          ? refreshedListings
          : refreshedListings?.listings || []
      );

      handleCancel();
    } catch (err) {
      setFormError(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };


  const listingColumns = [
    {
      key: 'id',
      header: 'Listing ID',
      className: 'px-4 py-4 text-sm text-dark',
      render: (listing) => listing.id ?? '—',
    },
    {
      key: 'moduleCode',
      header: 'Module',
      className: 'px-4 py-4 text-sm text-dark',
      render: (listing) => (
        <>
          <div className="font-medium">{listing.moduleCode || '—'}</div>
          {listing.moduleName && (
            <div className="mt-1 text-xs text-neutral">{listing.moduleName}</div>
          )}
        </>
      ),
    },
    {
      key: 'deadline',
      header: 'Deadline',
      className: 'px-4 py-4 text-sm text-dark',
      render: (listing) => formatDate(listing.deadline),
    },
    {
      key: 'minimumGrade',
      header: 'Minimum Grade',
      className: 'px-4 py-4 text-sm text-dark',
      render: (listing) =>
        listing.minimumGrade !== null && listing.minimumGrade !== undefined
          ? `${listing.minimumGrade}%`
          : '—',
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'px-4 py-4',
      render: (listing) => (
        <Button
          unstyled
          type="button"
          onClick={() => handleOpenEdit(listing)}
          className="font-medium text-primary transition hover:text-primary-dark"
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>

{/* Page Header */}


          <div className="p-8">
            <PageHeader
              title="Assistant Listings"
              description="Create and manage assistant positions for your modules."
            />


            {/* Create Button */}
            <div className="mb-6 flex justify-end">
              <Button unstyled
                type="button"
                onClick={handleOpenCreate}
                className="rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
              >
                Create Listing
              </Button>
            </div>


            {/* Loading / Error */}
            {loadError && (
              <div className="mb-6 rounded-lg border border-error/30 bg-status-danger-soft px-4 py-3 text-sm text-error">
                {loadError}
              </div>
            )}


            {/* Create / Edit Form */}
            {showForm && (
              <Card className="mb-6">
                <div className="mb-5">
                  <h2 className="text-section font-semibold text-primary-dark">
                    {editingId
                      ? 'Edit Assistant Listing'
                      : 'Create Assistant Listing'}
                  </h2>


                  <p className="mt-1 text-sm text-neutral">
                    {editingId
                      ? 'Update the details of this assistant position.'
                      : 'Create a new assistant position for one of your modules.'}
                  </p>
                </div>


                {formError && (
                  <div className="mb-5 rounded-lg border border-error/30 bg-status-danger-soft px-4 py-3 text-sm text-error">
                    {formError}
                  </div>
                )}


                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {/* Module */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral">
                        Module
                      </label>


                      <select
                        name="moduleId"
                        value={formData.moduleId}
                        onChange={handleChange}
                        disabled={
                          saving || modules.length === 0
                        }
                        className="w-full rounded-lg border border-neutral bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="">
                          {modules.length === 0
                            ? 'No modules available'
                            : 'Select a module'}
                        </option>


                        {modules.map((module) => {
                          const moduleId = getModuleId(module);
                          const moduleCode = getModuleCode(module);
                          const moduleName = getModuleName(module);


                          return (
                            <option
                              key={moduleId}
                              value={moduleId}
                            >
                              {moduleCode}
                              {moduleName
                                ? ` - ${moduleName}`
                                : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>


                    {/* Deadline */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral">
                        Application Deadline
                      </label>


                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        disabled={saving}
                        className="w-full rounded-lg border border-neutral bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                      />
                    </div>


                    {/* Minimum Grade */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral">
                        Minimum Grade
                      </label>


                      <input
                        type="number"
                        name="minimumGrade"
                        value={formData.minimumGrade}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="e.g. 60"
                        disabled={saving}
                        className="w-full rounded-lg border border-neutral bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>


                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button unstyled
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="rounded-lg border border-border-subtle px-5 py-3 font-semibold text-dark transition hover:bg-surface-muted"
                    >
                      Cancel
                    </Button>


                    <Button unstyled
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
                    >
                      {saving
                        ? 'Saving...'
                        : editingId
                        ? 'Update Listing'
                        : 'Create Listing'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}


            {/* Listings */}
            <Card>
              <div className="mb-5">
                <h2 className="text-section font-semibold text-primary-dark">
                  Your Assistant Listings
                </h2>


                <p className="mt-1 text-sm text-neutral">
                  View and manage the assistant positions you have created.
                </p>
              </div>


              {loading ? (
                <p className="py-6 text-center text-sm text-neutral">
                  Loading listings...
                </p>
              ) : (
                <DataTable
                  columns={listingColumns}
                  rows={listings.map(mapListing)}
                  getRowKey={(listing) => listing.id}
                  emptyTitle="No assistant listings found."
                  minWidth="750px"
                />
              )}
            </Card>
          </div>

    </>
  );
};


export default AssistantListings;