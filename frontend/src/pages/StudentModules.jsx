import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';

const StudentModules = () => {
  document.title = 'DACMS - Academic Modules & Grades';

  const [grades, setGrades] = useState([]);
  const [availableModules, setAvailableModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingGrade, setEditingGrade] = useState(null); // grade object being edited
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);

  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    moduleId: '',
    gradeAchieved: '',
    academicYear: currentYear,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [modulesRes, gradesRes] = await Promise.all([
        apiGet('/student/modules'),
        apiGet('/student/grades'),
      ]);

      setAvailableModules(modulesRes?.modules || []);
      setGrades(gradesRes?.grades || []);
    } catch (err) {
      setError(err.message || 'Failed to load module data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // KPIs
  const kpis = useMemo(() => {
    const totalModules = grades.length;
    if (totalModules === 0) {
      return {
        totalModules: 0,
        averageGrade: '—',
        distinctions: 0,
        eligibleCount: 0,
      };
    }

    const totalScore = grades.reduce(
      (sum, item) => sum + parseFloat(item.grade_achieved || 0),
      0
    );
    const avg = (totalScore / totalModules).toFixed(1);

    const distinctions = grades.filter(
      (item) => parseFloat(item.grade_achieved || 0) >= 75
    ).length;

    const eligibleCount = grades.filter(
      (item) =>
        parseFloat(item.grade_achieved || 0) >=
        parseFloat(item.min_academic_requirement || 65)
    ).length;

    return {
      totalModules,
      averageGrade: `${avg}%`,
      distinctions,
      eligibleCount,
    };
  }, [grades]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.moduleId) {
      setError('Please select a module.');
      return;
    }

    const gradeNum = parseFloat(formData.gradeAchieved);
    if (Number.isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      setError('Please enter a valid grade percentage between 0 and 100.');
      return;
    }

    const yearNum = parseInt(formData.academicYear, 10);
    if (Number.isNaN(yearNum) || yearNum < 2000 || yearNum > currentYear + 1) {
      setError(`Please enter a valid academic year (e.g., ${currentYear}).`);
      return;
    }

    try {
      setSaving(true);
      if (editingGrade) {
        await apiPut(`/student/grades/${editingGrade.grade_id}`, {
          gradeAchieved: gradeNum,
          academicYear: yearNum,
        });
        setSuccessMessage('Module mark updated successfully!');
      } else {
        await apiPost('/student/grades', {
          moduleId: parseInt(formData.moduleId, 10),
          gradeAchieved: gradeNum,
          academicYear: yearNum,
        });
        setSuccessMessage('Module mark recorded successfully!');
      }

      setFormData({
        moduleId: '',
        gradeAchieved: '',
        academicYear: currentYear,
      });
      setEditingGrade(null);
      setShowAddSection(false);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to save module mark.');
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (item) => {
    setError('');
    setSuccessMessage('');
    setEditingGrade(item);
    setFormData({
      moduleId: item.module_id,
      gradeAchieved: item.grade_achieved,
      academicYear: item.academic_year || currentYear,
    });
    setShowAddSection(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setEditingGrade(null);
    setFormData({
      moduleId: '',
      gradeAchieved: '',
      academicYear: currentYear,
    });
    setShowAddSection(false);
  };

  const handleDeleteGrade = async (gradeId, moduleCode) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${moduleCode} from your academic records?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(gradeId);
      setError('');
      setSuccessMessage('');
      await apiDelete(`/student/grades/${gradeId}`);
      setSuccessMessage(`Record for ${moduleCode} removed successfully.`);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to remove module mark.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="student" />

        <main className="flex-1">
          {/* Top Title Banner */}
          <div className="bg-primary h-16 flex items-center px-8">
            <h1 className="text-2xl font-poppins font-semibold text-white">
              Academic Modules
            </h1>
          </div>

          <div className="p-8">
            {/* Page Header and Add Module Button */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-poppins font-semibold text-primary">
                  My Modules & Grades
                </h2>
                <p className="text-neutral mt-2">
                  Manage your completed modules, academic marks, and graduation records.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccessMessage('');
                  if (showAddSection) {
                    handleCancelForm();
                  } else {
                    setEditingGrade(null);
                    setFormData({
                      moduleId: '',
                      gradeAchieved: '',
                      academicYear: currentYear,
                    });
                    setShowAddSection(true);
                  }
                }}
                className="rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark shadow-sm"
              >
                {showAddSection ? 'Close Form' : '+ Add Module'}
              </button>
            </div>

            {/* Alert Messages */}
            {successMessage && (
              <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <p className="text-sm text-neutral font-inter">Total Modules</p>
                <p className="text-3xl font-poppins font-bold text-primary mt-2">
                  {kpis.totalModules}
                </p>
              </Card>

              <Card>
                <p className="text-sm text-neutral font-inter">Average Mark</p>
                <p className="text-3xl font-poppins font-bold text-primary mt-2">
                  {kpis.averageGrade}
                </p>
              </Card>

              <Card>
                <p className="text-sm text-neutral font-inter">Distinctions (≥ 75%)</p>
                <p className="text-3xl font-poppins font-bold text-primary mt-2">
                  {kpis.distinctions}
                </p>
              </Card>

              <Card>
                <p className="text-sm text-neutral font-inter">Assistant Eligible</p>
                <p className="text-3xl font-poppins font-bold text-primary mt-2">
                  {kpis.eligibleCount}
                </p>
              </Card>
            </div>

            {/* Add/Edit Module Collapsible Section */}
            {showAddSection && (
              <Card className="mb-8 border border-purple-100 shadow-sm">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h3 className="text-lg font-poppins font-semibold text-primary">
                    {editingGrade ? 'Edit Module Mark' : 'Record Module Mark'}
                  </h3>
                  <p className="text-sm text-neutral mt-1">
                    {editingGrade
                      ? 'Update the achieved mark and academic year for this module.'
                      : 'Select the module, enter the final grade achieved, and specify the academic year.'}
                  </p>
                </div>

                <form onSubmit={handleSaveGrade}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Module Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral mb-2">
                        Module <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="moduleId"
                        value={formData.moduleId}
                        onChange={handleInputChange}
                        required
                        disabled={saving || Boolean(editingGrade)}
                        className="w-full rounded-lg border border-neutral bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">-- Select Module --</option>
                        {availableModules.map((mod) => (
                          <option key={mod.module_id} value={mod.module_id}>
                            {mod.module_code} - {mod.module_name}
                          </option>
                        ))}
                      </select>
                      {editingGrade && (
                        <p className="text-xs text-neutral mt-1">Module cannot be changed when editing.</p>
                      )}
                    </div>

                    {/* Grade Achieved */}
                    <div>
                      <label className="block text-sm font-medium text-neutral mb-2">
                        Grade Achieved (%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        name="gradeAchieved"
                        value={formData.gradeAchieved}
                        onChange={handleInputChange}
                        placeholder="e.g. 78.50"
                        required
                        disabled={saving}
                        className="w-full rounded-lg border border-neutral bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-purple-200"
                      />
                    </div>

                    {/* Academic Year */}
                    <div>
                      <label className="block text-sm font-medium text-neutral mb-2">
                        Year Taken <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="2000"
                        max={currentYear + 1}
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleInputChange}
                        required
                        disabled={saving}
                        className="w-full rounded-lg border border-neutral bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      disabled={saving}
                      className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary-dark transition disabled:opacity-50"
                    >
                      {saving
                        ? 'Saving...'
                        : editingGrade
                        ? 'Update Module'
                        : 'Save Module'}
                    </button>
                  </div>
                </form>
              </Card>
            )}

            {/* List Table of Modules */}
            <Card>
              <div className="border-b border-gray-100 pb-4 mb-4 flex items-center justify-between">
                <h3 className="text-lg font-poppins font-semibold text-primary">
                  Recorded Modules
                </h3>
                <span className="text-sm font-inter text-neutral">
                  {grades.length} {grades.length === 1 ? 'record' : 'records'}
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-neutral font-inter">
                  Loading academic records...
                </div>
              ) : grades.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-medium text-dark font-inter">
                    No academic module marks recorded yet.
                  </p>
                  <p className="mt-1 text-sm text-neutral font-inter">
                    Click the "+ Add Module" button above to add your completed modules.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-neutral">
                        <th className="py-3 px-4">Year</th>
                        <th className="py-3 px-4">Module Code</th>
                        <th className="py-3 px-4">Module Description</th>
                        <th className="py-3 px-4 text-center">Grade Achieved</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {grades.map((item) => {
                        const gradeVal = parseFloat(item.grade_achieved || 0);
                        const minReq = parseFloat(item.min_academic_requirement || 65);
                        const isEligible = gradeVal >= minReq;
                        const isDistinction = gradeVal >= 75;

                        return (
                          <tr
                            key={item.grade_id}
                            className="hover:bg-gray-50/80 transition-colors"
                          >
                            <td className="py-4 px-4 font-medium text-gray-800">
                              {item.academic_year || '—'}
                            </td>
                            <td className="py-4 px-4 font-semibold text-primary">
                              {item.module_code}
                            </td>
                            <td className="py-4 px-4 text-gray-600 max-w-md">
                              <p className="font-medium text-gray-900">
                                {item.module_name}
                              </p>
                              {item.description && (
                                <p className="text-xs text-neutral mt-0.5 line-clamp-1">
                                  {item.description}
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center font-bold">
                              <span
                                className={
                                  isDistinction
                                    ? 'text-green-600'
                                    : gradeVal >= 50
                                    ? 'text-gray-900'
                                    : 'text-red-500'
                                }
                              >
                                {Number(gradeVal).toFixed(2)}%
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              {isDistinction ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Distinction
                                </span>
                              ) : isEligible ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-primary">
                                  Eligible
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  Completed
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(item)}
                                  disabled={deletingId === item.grade_id}
                                  className="text-sm font-medium text-primary hover:text-primary-dark transition disabled:opacity-50"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteGrade(item.grade_id, item.module_code)
                                  }
                                  disabled={deletingId === item.grade_id}
                                  className="text-sm font-medium text-red-600 hover:text-red-800 transition disabled:opacity-50"
                                >
                                  {deletingId === item.grade_id ? 'Removing...' : 'Delete'}
                                </button>
                              </div>
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

export default StudentModules;
