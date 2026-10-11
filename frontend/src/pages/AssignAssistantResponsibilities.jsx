import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { apiGet, apiPut } from '../api';

const AssignAssistantResponsibilities = () => {
  document.title = 'AACMS - Assign Duties';
  const [assistants, setAssistants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveFeedback, setSaveFeedback] = useState({});

  useEffect(() => {
    let isCurrent = true;

    const loadAssistants = async () => {
      try {
        const result = await apiGet('/lecturer/assistants');
        if (!Array.isArray(result?.assistants)) {
          throw new Error('The assistant list response was invalid.');
        }
        if (isCurrent) setAssistants(result.assistants);
      } catch (error) {
        if (isCurrent) setLoadError(error.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    loadAssistants();
    return () => {
      isCurrent = false;
    };
  }, []);

  // Handle checkbox changes
  const handleResponsibilityChange = (id, responsibility) => {
    setAssistants((prev) =>
      prev.map((assistant) =>
        assistant.id === id
          ? {
              ...assistant,
              responsibilities: {
                ...assistant.responsibilities,
                [responsibility]: !assistant.responsibilities[responsibility],
              },
            }
          : assistant
      )
    );
  };

  // Handle hour limit change
  const handleHourLimitChange = (id, value) => {
    setAssistants((prev) =>
      prev.map((assistant) =>
        assistant.id === id ? { ...assistant, hourLimit: value } : assistant
      )
    );
  };

  const handleSave = async (id) => {
    const assistant = assistants.find((a) => a.id === id);
    if (!assistant) return;

    setSaveFeedback((current) => ({
      ...current,
      [id]: { isSaving: true, message: '', isError: false },
    }));

    try {
      const result = await apiPut(
        `/lecturer/assistants/${encodeURIComponent(id)}/responsibilities`,
        {
          hourLimit: assistant.hourLimit,
          responsibilities: assistant.responsibilities,
        }
      );

      setAssistants((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                hourLimit: result.data.hourLimit,
                responsibilities: result.data.responsibilities,
              }
            : item
        )
      );
      setSaveFeedback((current) => ({
        ...current,
        [id]: {
          isSaving: false,
          message: `Responsibilities saved for ${assistant.name}.`,
          isError: false,
        },
      }));
    } catch (error) {
      setSaveFeedback((current) => ({
        ...current,
        [id]: { isSaving: false, message: error.message, isError: true },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        {/* ===== SIDEBAR ===== */}
        <Sidebar userRole="lecturer" />

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1">
          {/* ===== PAGE TITLE BAR ===== */}
          <div className="bg-primary h-16 flex items-center px-8">
            <h1 className="text-2xl font-poppins font-semibold text-white">
              Assign Assistant Responsibilities
            </h1>
          </div>

          {/* ===== MAIN CONTENT ===== */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <p className="text-neutral text-base font-inter">
                Assign responsibilities and set hour limits for your approved
                assistants.
              </p>
            </div>

            {/* ===== APPROVED ASSISTANTS ===== */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary mb-4">
                Approved Assistants
              </h2>

              {isLoading && (
                <p className="text-neutral font-inter" role="status">
                  Loading approved assistants...
                </p>
              )}
              {!isLoading && loadError && (
                <p className="text-red-700 font-inter" role="alert">
                  Unable to load approved assistants: {loadError}
                </p>
              )}
              {!isLoading && !loadError && assistants.length === 0 && (
                <p className="text-neutral font-inter">
                  No approved assistants are available to assign.
                </p>
              )}

              <div className="space-y-6">
                {assistants.map((assistant) => (
                  <Card key={assistant.id}>
                    {/* Assistant Info */}
                    <div className="mb-6 pb-4 border-b border-neutral">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-lightest flex items-center justify-center text-primary font-bold text-lg font-poppins">
                          {assistant.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-poppins font-semibold text-dark">
                            {assistant.name}
                          </h3>
                          <p className="text-sm text-neutral font-inter">
                            Student #: {assistant.studentNumber} | Module:{' '}
                            {assistant.module} | Hours Worked:{' '}
                            {assistant.hoursWorked} hrs
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="mb-6">
                      <h4 className="text-lg font-poppins font-semibold text-dark mb-3">
                        Responsibilities
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={assistant.responsibilities.tutoring}
                            onChange={() =>
                              handleResponsibilityChange(assistant.id, 'tutoring')
                            }
                            className="w-5 h-5 accent-primary"
                          />
                          <span className="text-dark font-inter">Tutoring</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={assistant.responsibilities.marking}
                            onChange={() =>
                              handleResponsibilityChange(assistant.id, 'marking')
                            }
                            className="w-5 h-5 accent-primary"
                          />
                          <span className="text-dark font-inter">Marking</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={assistant.responsibilities.invigilation}
                            onChange={() =>
                              handleResponsibilityChange(
                                assistant.id,
                                'invigilation'
                              )
                            }
                            className="w-5 h-5 accent-primary"
                          />
                          <span className="text-dark font-inter">
                            Invigilation
                          </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={assistant.responsibilities.labAssistance}
                            onChange={() =>
                              handleResponsibilityChange(
                                assistant.id,
                                'labAssistance'
                              )
                            }
                            className="w-5 h-5 accent-primary"
                          />
                          <span className="text-dark font-inter">
                            Lab Assistance
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Hour Limit */}
                    <div className="mb-6">
                      <h4 className="text-lg font-poppins font-semibold text-dark mb-3">
                        Hour Limit
                      </h4>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          value={assistant.hourLimit}
                          onChange={(e) =>
                            handleHourLimitChange(assistant.id, e.target.value)
                          }
                          className="w-32 px-4 py-2 border border-neutral rounded-xl font-inter text-dark focus:outline-none focus:border-primary"
                          aria-label={`Hour limit for ${assistant.name}`}
                          min="1"
                          max="40"
                        />
                        <span className="text-neutral font-inter">hrs</span>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSave(assistant.id)}
                        disabled={saveFeedback[assistant.id]?.isSaving}
                        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition font-inter disabled:opacity-60"
                      >
                        {saveFeedback[assistant.id]?.isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                    {saveFeedback[assistant.id]?.message && (
                      <p
                        className={`mt-3 text-sm font-inter ${
                          saveFeedback[assistant.id].isError
                            ? 'text-red-700'
                            : 'text-green-700'
                        }`}
                        role={saveFeedback[assistant.id].isError ? 'alert' : 'status'}
                      >
                        {saveFeedback[assistant.id].message}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssignAssistantResponsibilities;