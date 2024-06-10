import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";

const EditStudentModal = ({
  isOpen,
  onClose,
  student,
  groups = [],
  onUpdateStudent,
}) => {
  const [updatedStudent, setUpdatedStudent] = useState({ ...student });

  useEffect(() => {
    if (student) {
      setUpdatedStudent({ ...student });
    }
  }, [student]);

  const handleGroupChange = (selectedOptions) => {
    const selectedGroups = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setUpdatedStudent({ ...updatedStudent, groups: selectedGroups });
  };

  const groupOptions = groups.map((group) => ({ value: group, label: group }));

  return (
    isOpen && (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <button
              className="absolute right-0 top-0 mr-4 mt-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="mb-4 text-lg font-semibold">Edit Student</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateStudent(updatedStudent);
              }}
            >
              <div className="mb-4">
                <label
                  className="mb-2 block text-sm font-bold"
                  htmlFor="student_number"
                >
                  Student Number
                </label>
                <input
                  type="text"
                  id="student_number"
                  name="student_number"
                  value={updatedStudent.student_number}
                  onChange={(e) =>
                    setUpdatedStudent({
                      ...updatedStudent,
                      student_number: e.target.value,
                    })
                  }
                  className="w-full rounded border bg-gray-100 p-2 px-3 py-2 text-base outline-none transition-all duration-300 focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label
                  className="mb-2 block text-sm font-bold"
                  htmlFor="first_name"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={updatedStudent.first_name}
                  onChange={(e) =>
                    setUpdatedStudent({
                      ...updatedStudent,
                      first_name: e.target.value,
                    })
                  }
                  className="w-full rounded border bg-gray-100 p-2 px-3 py-2 text-base outline-none transition-all duration-300 focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label
                  className="mb-2 block text-sm font-bold"
                  htmlFor="last_name"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={updatedStudent.last_name}
                  onChange={(e) =>
                    setUpdatedStudent({
                      ...updatedStudent,
                      last_name: e.target.value,
                    })
                  }
                  className="w-full rounded border bg-gray-100 p-2 px-3 py-2 text-base outline-none transition-all duration-300 focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label
                  className="mb-2 block text-sm font-bold"
                  htmlFor="groups"
                >
                  Groups
                </label>
                <Select
                  isMulti
                  name="groups"
                  options={groupOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={handleGroupChange}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded border bg-primary p-2 text-white"
              >
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
