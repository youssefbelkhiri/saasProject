import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const EditStudentModal = ({ isOpen, onClose, student, groups = [], onUpdateStudent }) => {
  const [updatedStudent, setUpdatedStudent] = useState({ ...student });

  useEffect(() => {
    if (student) {
      setUpdatedStudent({ ...student });
    }
  }, [student]);

  const handleGroupChange = (selectedOptions) => {
    const selectedGroups = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setUpdatedStudent({ ...updatedStudent, groups: selectedGroups });
  };

  const groupOptions = groups.map(group => ({ value: group, label: group }));

  return (
    isOpen && (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
            <button className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-lg font-semibold mb-4">Edit Student</h2>

            <form onSubmit={(e) => { e.preventDefault(); onUpdateStudent(updatedStudent); }}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="student_number">
                  Student Number
                </label>
                <input
                  type="text"
                  id="student_number"
                  name="student_number"
                  value={updatedStudent.studentNumber}
                  onChange={(e) => setUpdatedStudent({ ...updatedStudent, studentNumber: e.target.value })}
                  className="w-full p-2 border rounded bg-gray-100 px-3 py-2 text-base outline-none transition-all duration-300 focus:border-primary"
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
                  value={updatedStudent.firstName}
                  onChange={(e) => setUpdatedStudent({ ...updatedStudent, firstName: e.target.value })}
                  className="w-full p-2 border rounded bg-gray-100 px-3 py-2 text-base outline-none transition-all duration-300 focus:border-primary"
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
                  value={updatedStudent.lastName}
                  onChange={(e) => setUpdatedStudent({ ...updatedStudent, lastName: e.target.value })}
                  className="w-full p-2 border rounded bg-gray-100 px-3 py-2 text-base outline-none transition-all duration-300 focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="groups">
                  Groups
                </label>
                <Select
                  isMulti
                  name="groups"
                  value={groupOptions.filter(option => updatedStudent.groups.includes(option.value))}
                  options={groupOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={handleGroupChange}
                />
              </div>

              <button type="submit" className="w-full p-2 border rounded bg-primary text-white">
                Update Student
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default EditStudentModal;
