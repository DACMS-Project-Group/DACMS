import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

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
    if (!lecturerForm.lecturer || !lecturerForm.allocation) {
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
    <div className="min-h-screen bg-off-white">

      <Navbar />

      <div className="flex">

        <Sidebar userRole="admin" />

        <main className="flex-1">

          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Edit Budget
            </h1>
          </div>

          {/* Page Content */}
          <div className="p-8">

            {/* Page Introduction */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                Edit Budget Information
              </h2>

              <p className="text-neutral mt-2 font-inter">
                Update the budget allocation and lecturer information.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Budget Information */}
              <section className="mb-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">

                  <h3 className="text-2xl font-poppins font-semibold text-primary">
                    Budget Information
                  </h3>

                  <span className="text-sm text-neutral font-inter">
                    Budget ID: {id}
                  </span>

                </div>

                <Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Module Code */}
                    <div>
                      <label
                        htmlFor="moduleCode"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Module Code
                      </label>

                      <input
                        id="moduleCode"
                        type="text"
                        value={formData.moduleCode}
                        readOnly
                        className="w-full h-12 px-4 border border-neutral rounded-xl bg-primary-lightest font-inter"
                      />
                    </div>

                    {/* Module Name */}
                    <div>
                      <label
                        htmlFor="moduleName"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Module Name
                      </label>

                      <input
                        id="moduleName"
                        type="text"
                        value={formData.moduleName}
                        readOnly
                        className="w-full h-12 px-4 border border-neutral rounded-xl bg-primary-lightest font-inter"
                      />
                    </div>

                    {/* Allocated Budget */}
                    <div>
                      <label
                        htmlFor="allocatedBudget"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Allocated Budget
                      </label>

                      <div className="flex">

                        <span className="flex items-center px-4 bg-primary-lightest border border-r-0 border-neutral rounded-l-xl font-inter text-primary font-semibold">
                          R
                        </span>

                        <input
                          id="allocatedBudget"
                          type="number"
                          name="allocatedBudget"
                          value={formData.allocatedBudget}
                          onChange={handleChange}
                          className="w-full h-12 px-4 border border-neutral rounded-r-xl focus:outline-none focus:border-primary font-inter"
                        />

                      </div>
                    </div>

                    {/* Budget Year */}
                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Budget Year
                      </label>

                      <select
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
                      >
                        <option>2026</option>
                        <option>2027</option>
                        <option>2028</option>
                      </select>
                    </div>

                    {/* Budget Period */}
                    <div>
                      <label
                        htmlFor="budgetPeriod"
                        className="block text-sm font-medium text-neutral mb-2 font-inter"
                      >
                        Budget Period
                      </label>

                      <select
                        id="budgetPeriod"
                        name="budgetPeriod"
                        value={formData.budgetPeriod}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
                      >
                        <option>Semester 1</option>
                        <option>Semester 2</option>
                        <option>Full Year</option>
                      </select>
                    </div>

                  </div>

                </Card>

              </section>

              {/* Lecturer Allocation */}
              <section className="mb-8">

                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Lecturer Allocation
                </h3>

                <Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Lecturer */}
                    <select
                      value={lecturerForm.lecturer}
                      onChange={(e) =>
                        setLecturerForm({
                          ...lecturerForm,
                          lecturer: e.target.value,
                        })
                      }
                      className="h-12 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
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

                    {/* Allocation */}
                    <div className="flex">

                      <span className="flex items-center px-4 bg-primary-lightest border border-r-0 border-neutral rounded-l-xl font-inter text-primary font-semibold">
                        R
                      </span>

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
                        className="w-full h-12 px-4 border border-neutral rounded-r-xl focus:outline-none focus:border-primary font-inter"
                      />

                    </div>

                    {/* Add Lecturer */}
                    <button
                      type="button"
                      onClick={addLecturer}
                      className="h-12 px-6 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary-lightest transition font-inter"
                    >
                      + Add Lecturer
                    </button>

                  </div>

                  {/* Lecturer Table */}
                  <div className="mt-6 overflow-x-auto">

                    <table className="w-full">

                      <thead className="bg-primary-lightest">
                        <tr>

                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Lecturer
                          </th>

                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Allocation
                          </th>

                          <th className="p-4 text-right text-sm font-semibold text-primary font-inter">
                            Action
                          </th>

                        </tr>
                      </thead>

                      <tbody>

                        {lecturers.map((lecturer, index) => (
                          <tr
                            key={index}
                            className="border-t border-neutral/30 hover:bg-primary-lightest/30 transition"
                          >

                            <td className="p-4 text-dark font-inter">
                              {lecturer.lecturer}
                            </td>

                            <td className="p-4 text-dark font-inter">
                              R{' '}
                              {Number(
                                lecturer.allocation
                              ).toLocaleString('en-ZA')}
                            </td>

                            <td className="p-4 text-right">

                              <button
                                type="button"
                                onClick={() =>
                                  removeLecturer(index)
                                }
                                className="text-red-600 font-semibold hover:underline font-inter"
                              >
                                Remove
                              </button>

                            </td>

                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>

                  {/* Total Allocation */}
                  <div className="flex justify-end mt-6 pt-6 border-t border-neutral/30">

                    <div className="text-right">

                      <p className="text-sm text-neutral font-inter">
                        Total Lecturer Allocation
                      </p>

                      <p className="text-2xl font-poppins font-bold text-primary mt-1">
                        R{' '}
                        {totalAllocation.toLocaleString(
                          'en-ZA'
                        )}
                      </p>

                    </div>

                  </div>

                </Card>

              </section>

              {/* Form Actions */}
              <div className="flex justify-end gap-4">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/budget-management/details/${id}`
                    )
                  }
                  className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-lightest transition font-inter"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
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