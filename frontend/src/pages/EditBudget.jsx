import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const EditBudget = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    moduleCode: 'CMPG323',
    moduleName: 'Software Engineering',
    allocatedBudget: '75000',
    year: '2026',
    budgetPeriod: 'Semester 2',
  });

  const [lecturers, setLecturers] = useState([
    {
      lecturer: 'Dr John Example',
      allocation: '20000',
    },
    {
      lecturer: 'Prof Jane Example',
      allocation: '15000',
    },
    {
      lecturer: 'Dr Michael Example',
      allocation: '10000',
    },
  ]);

  const [lecturerForm, setLecturerForm] = useState({
    lecturer: '',
    allocation: '',
  });

  const lecturerList = [
    'Dr John Example',
    'Prof Jane Example',
    'Dr Michael Example',
    'Ms Sarah Example',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addLecturer = () => {
    if (
      !lecturerForm.lecturer ||
      !lecturerForm.allocation
    ) {
      return;
    }

    setLecturers([
      ...lecturers,
      lecturerForm,
    ]);

    setLecturerForm({
      lecturer: '',
      allocation: '',
    });
  };

  const removeLecturer = (index) => {
    setLecturers(
      lecturers.filter((_, i) => i !== index)
    );
  };

  const totalAllocation = lecturers.reduce(
    (total, lecturer) =>
      total + Number(lecturer.allocation),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Updated Budget:', {
      id,
      ...formData,
      lecturers,
    });

    navigate(`/budget-management/details/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-8">

          <div className="bg-[#6C3D91] text-white px-8 py-5 rounded-t-lg">
            <h1 className="text-3xl font-bold">
              Edit Budget
            </h1>
          </div>

          <div className="bg-white p-8">

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6C3D91]">
                Edit Budget Information
              </h2>

              <p className="text-[#78848E] mt-1">
                Update the budget allocation and lecturer information.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Budget details */}
              <div className="border border-[#78848E] rounded-xl p-6 mb-8">

                <div className="flex justify-between mb-6">

                  <h3 className="text-lg font-semibold text-[#6C3D91]">
                    Budget Information
                  </h3>

                  <span className="text-sm text-[#78848E]">
                    Budget ID: {id}
                  </span>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-[#78848E] mb-2">
                      Module Code
                    </label>

                    <input
                      type="text"
                      value={formData.moduleCode}
                      readOnly
                      className="w-full h-12 px-4 border border-[#78848E] rounded-xl bg-[#F3F4F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#78848E] mb-2">
                      Module Name
                    </label>

                    <input
                      type="text"
                      value={formData.moduleName}
                      readOnly
                      className="w-full h-12 px-4 border border-[#78848E] rounded-xl bg-[#F3F4F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#78848E] mb-2">
                      Allocated Budget
                    </label>

                    <div className="flex">
                      <span className="flex items-center px-4 bg-[#F3F4F6] border border-r-0 border-[#78848E] rounded-l-xl">
                        R
                      </span>

                      <input
                        type="number"
                        name="allocatedBudget"
                        value={formData.allocatedBudget}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border border-[#78848E] rounded-r-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#78848E] mb-2">
                      Budget Year
                    </label>

                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border border-[#78848E] rounded-xl"
                    >
                      <option>2026</option>
                      <option>2027</option>
                      <option>2028</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#78848E] mb-2">
                      Budget Period
                    </label>

                    <select
                      name="budgetPeriod"
                      value={formData.budgetPeriod}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border border-[#78848E] rounded-xl"
                    >
                      <option>Semester 1</option>
                      <option>Semester 2</option>
                      <option>Full Year</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* Lecturer allocation */}
              <div className="border border-[#78848E] rounded-xl p-6 mb-8">

                <h3 className="text-lg font-semibold text-[#6C3D91] mb-6">
                  Lecturer Allocation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <select
                    value={lecturerForm.lecturer}
                    onChange={(e) =>
                      setLecturerForm({
                        ...lecturerForm,
                        lecturer: e.target.value,
                      })
                    }
                    className="h-12 px-4 border border-[#78848E] rounded-xl"
                  >
                    <option value="">
                      Select Lecturer
                    </option>

                    {lecturerList.map((lecturer) => (
                      <option key={lecturer}>
                        {lecturer}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Allocation Amount"
                    value={lecturerForm.allocation}
                    onChange={(e) =>
                      setLecturerForm({
                        ...lecturerForm,
                        allocation: e.target.value,
                      })
                    }
                    className="h-12 px-4 border border-[#78848E] rounded-xl"
                  />

                  <button
                    type="button"
                    onClick={addLecturer}
                    className="h-12 px-6 border-2 border-[#6C3D91] text-[#6C3D91] rounded-xl font-semibold hover:bg-[#E8DDF0]"
                  >
                    + Add Lecturer
                  </button>

                </div>

                <div className="mt-6">

                  <table className="w-full">

                    <thead className="bg-[#F3F4F6]">

                      <tr>
                        <th className="text-left p-4 text-sm text-[#78848E]">
                          Lecturer
                        </th>

                        <th className="text-left p-4 text-sm text-[#78848E]">
                          Allocation
                        </th>

                        <th className="text-right p-4 text-sm text-[#78848E]">
                          Action
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {lecturers.map(
                        (lecturer, index) => (
                          <tr
                            key={index}
                            className="border-b"
                          >

                            <td className="p-4">
                              {lecturer.lecturer}
                            </td>

                            <td className="p-4">
                              R{' '}
                              {Number(
                                lecturer.allocation
                              ).toLocaleString(
                                'en-ZA'
                              )}
                            </td>

                            <td className="p-4 text-right">

                              <button
                                type="button"
                                onClick={() =>
                                  removeLecturer(
                                    index
                                  )
                                }
                                className="text-[#DC3545] font-semibold"
                              >
                                Remove
                              </button>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

                <div className="flex justify-end mt-6">

                  <div className="text-right">
                    <p className="text-sm text-[#78848E]">
                      Total Lecturer Allocation
                    </p>

                    <p className="text-xl font-bold text-[#6C3D91]">
                      R{' '}
                      {totalAllocation.toLocaleString(
                        'en-ZA'
                      )}
                    </p>
                  </div>

                </div>

              </div>

              <div className="flex justify-end gap-4">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/budget-management/details/${id}`
                    )
                  }
                  className="h-11 px-6 border border-[#78848E] rounded-xl font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-11 px-6 bg-[#6C3D91] text-white rounded-xl font-semibold hover:bg-[#5A3280]"
                >
                  Save Changes
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