import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const AssignAssistantResponsibilities = () => {
  const navigate = useNavigate();

  // Sample approved assistants data
  const [assistants, setAssistants] = useState([
    {
      id: 1,
      name: 'Thamsanqa Ndlakuse',
      studentNumber: '51480204',
      module: 'MATH201',
      hoursWorked: 12.5,
      responsibilities: {
        tutoring: true,
        marking: false,
        invigilation: false,
        labAssistance: true,
      },
      hourLimit: 20,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      studentNumber: '49876543',
      module: 'PHYS101',
      hoursWorked: 8.0,
      responsibilities: {
        tutoring: false,
        marking: true,
        invigilation: false,
        labAssistance: true,
      },
      hourLimit: 15,
    },
  ]);

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

  // Handle save
  const handleSave = (id) => {
    const assistant = assistants.find((a) => a.id === id);
    console.log('Saving:', assistant);
    // TODO: API call to save responsibilities and hour limit
    alert(`Responsibilities saved for ${assistant.name}`);
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
            <h1 className="text-3xl font-poppins font-bold text-white">
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
                        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                      >
                        Save
                      </button>
                    </div>
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