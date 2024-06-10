import { useState } from "react";
import axios from "axios";
import Select from "react-select";

const AddStudentModal = ({ isOpen, onClose, groups }) => {
  const [newStudent, setNewStudent] = useState({
    student_number: "",
    first_name: "",
    last_name: "",
    groups: groups,
  });

  const options = groups.map((group) => ({
    value: group.group_id,
    label: group.name,
  }));

  const addStudent = async (e) => {
    e.preventDefault();
    console.log("New Student Data:", newStudent);

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:3000/api/students",
        newStudent,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      console.log("Student added successfully:", response.data);
      setNewStudent({
        student_number: "",
        first_name: "",
        last_name: "",
        groups: [],
      });
      onClose();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-dark">
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

            <h2 className="mb-4 text-lg font-semibold">Add Student</h2>

            <form onSubmit={addStudent}>
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
                  value={newStudent.student_number}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      student_number: e.target.value,
                    })
                  }
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
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
                  value={newStudent.first_name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, first_name: e.target.value })
                  }
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
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
                  value={newStudent.last_name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, last_name: e.target.value })
                  }
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
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
                  id="groups"
                  name="groups"
                  value={options.filter(({ value }) =>
                    newStudent.groups.includes(value),
                  )}
                  onChange={(selectedOptions) =>
                    setNewStudent({
                      ...newStudent,
                      groups: selectedOptions.map(({ value }) => value),
                    })
                  }
                  options={options}
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded border bg-primary p-2 text-white"
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
