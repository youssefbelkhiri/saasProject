import { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const AddStudentModal = ({ isOpen, onClose, groups }) => {
  const [newStudent, setNewStudent] = useState({
    studentNumber: '',
    firstName: '',
    lastName: '',
    groups: [],
  });

  const options = groups.map((group) => ({ value: group, label: group }));

  const addStudent = async () => {
    console.log('New Student Data:', newStudent);

  };

  return (
    isOpen && (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl dark:bg-dark">
            <button className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-lg font-semibold mb-4">Add Student</h2>

            <form onSubmit={addStudent}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="student_number">
                  Student Number
                </label>
                <input
                  type="text"
                  id="student_number"
                  name="student_number"
                  value={newStudent.studentNumber}
                  onChange={(e) => setNewStudent({ ...newStudent, studentNumber: e.target.value })}
                  className="w-full p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="first_name">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={newStudent.firstName}
                  onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                  className="w-full p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="last_name">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={newStudent.lastName}
                  onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                  className="w-full p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="groups">
                  Groups
                </label>
                <Select
                  id="groups"
                  name="groups"
                  value={options.filter(({ value }) => newStudent.groups.includes(value))}
                  onChange={(selectedOptions) => setNewStudent({ ...newStudent, groups: selectedOptions.map(({ value }) => value) })}
                  options={options}
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>

              <button
                type="submit"
                className="w-full p-2 border rounded bg-primary text-white"
              >
                Add Student
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default AddStudentModal;
