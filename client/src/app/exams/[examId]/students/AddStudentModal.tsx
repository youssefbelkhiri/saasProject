// AddStudentModal.tsx

import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import StudentTableModal from "./StudentTableModal";
import axios from "axios";

const AddStudentModal = ({ isOpen, onClose, examId }) => {
  const [newStudent, setNewStudent] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
    groups: [],
  });

  interface Paper {
    studentIds: number[];
    exams_id: number;
  }

  const [paperOfStudents, setPaperOfStudents] = useState<Paper>({
    studentIds: [],
    exams_id: Number(examId),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [Students, setStudents] = useState([]);

  // Sample list of groups
  // const groups = ["Group A", "Group B", "Group C", "Group D"];
  const allStudentsRef = useRef([]);
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        const groupsResponse = await axios.get(
          "http://localhost:3000/api/groups",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        console.log(groupsResponse.data);
        setGroups(groupsResponse.data);
        const allStudents = groupsResponse.data.flatMap((group) =>
          group.students.map((student) => ({
            ...student,
            groups: [group.name],
          })),
        );
        console.log(allStudents);
        allStudentsRef.current = allStudents;
        setStudents(allStudents);
      } catch (error) {
        console.error("Error fetching students and groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const updateFilteredStudents = (selectedGroupId) => {
    console.log(selectedGroupId);
    if (selectedGroupId === "All") {
      setStudents(allStudentsRef.current);
    } else {
      const filteredStudents = allStudentsRef.current.filter((student) =>
        student.groups.includes(selectedGroupId),
      );
      setStudents(filteredStudents);
    }
  };

  useEffect(() => {
    console.log("Selected students:", Students);
  }, [Students]);

  const options = [
    { value: "All", label: "All" },
    ...groups.map((group) => ({ value: group.group_id, label: group.name })),
  ];

  const deleteStudent = (studentId) => {
    // Implement delete functionality here
  };

  // const filteredStudents = selectedStudents.filter((student) => {
  //   const includesQuery = `${student.first_name} ${student.last_name}`
  //     .toLowerCase()
  //     .includes(searchQuery.toLowerCase());
  //   const includesGroup =
  //     selectedGroup && selectedGroup.value !== "All"
  //       ? student.groups.includes(selectedGroup.value)
  //       : true;
  //   return includesQuery && includesGroup;
  // });

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(Students.map((student) => student.student_id));
    }
    setSelectAll(!selectAll);
  };

  const toggleStudentSelection = (studentId) => {
    const selectedIndex = selectedStudents.indexOf(studentId);
    let newSelected = [...selectedStudents];

    if (selectedIndex === -1) {
      newSelected.push(studentId);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setSelectedStudents(newSelected);
  };

  const addStudent = async () => {
    console.log("Selected Student IDs:", selectedStudents);
    setPaperOfStudents({
      studentIds: selectedStudents,
      exams_id: Number(examId),
    });
    console.log(paperOfStudents);
    try {
      const authToken = localStorage.getItem("authToken");

      const response = await axios.post(
        "http://localhost:3000/api/papers/createPapers",
        paperOfStudents,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error creating students paper", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="fixed relative z-20 mx-auto w-4/5 max-w-7xl items-center justify-center overflow-y-auto overflow-x-hidden rounded-lg bg-white p-6 shadow-xl dark:bg-dark">
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
            <h2 className="mb-4 text-lg font-semibold">Add Students to Exam</h2>

            <div className="mt-10">
              <div className="mb-6 w-full">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="mb-6 w-full">
                <Select
                  options={options}
                  defaultValue={options[0]}
                  onChange={(selectedOption) => {
                    setSelectedGroup(selectedOption);
                    updateFilteredStudents(selectedOption.label);
                  }}
                  className="text-primary"
                />
              </div>
              <table className="mt-4 w-full">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-blue-500"
                      />
                    </th>
                    <th className="border px-4 py-2">Student Number</th>
                    <th className="border px-4 py-2">First Name</th>
                    <th className="border px-4 py-2">Last Name</th>
                    <th className="border px-4 py-2">Groups</th>
                  </tr>
                </thead>
                <tbody>
                  {Students.map((student) => (
                    <tr
                      key={student.student_id}
                      className={
                        selectedStudents.includes(student.student_id)
                          ? "bg-gray-200 dark:bg-gray-500"
                          : ""
                      }
                    >
                      <td className="border px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(
                            student.student_id,
                          )}
                          onChange={() =>
                            toggleStudentSelection(student.student_id)
                          }
                          className="h-4 w-4 text-blue-500"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        {student.student_number}
                      </td>
                      <td className="border px-4 py-2">{student.first_name}</td>
                      <td className="border px-4 py-2">{student.last_name}</td>
                      <td className="border px-4 py-2">
                        {student.groups?.length > 0
                          ? student.groups.join(", ")
                          : "No Groups"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="mr-4 rounded bg-red-500 px-4 py-2 text-white"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded bg-primary px-4 py-2 text-white"
                onClick={addStudent}
              >
                Add Students
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AddStudentModal;
