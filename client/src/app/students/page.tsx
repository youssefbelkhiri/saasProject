"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ManageGroupsModal from "./ManageGroupsModal";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import StudentTable from "./StudentTable";
import axios from "axios";

const StudentsPage = () => {
  const [isManageGroupsModalOpen, setIsManageGroupsModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const sampleStudents = [
    {
      id: 1,
      student_number: "1001",
      first_name: "John",
      last_name: "Doe",
      groups: [1, 2],
    },
    {
      id: 2,
      student_number: "1002",
      first_name: "Jane",
      last_name: "Smith",
      groups: [2],
    },
    {
      id: 3,
      student_number: "1003",
      first_name: "Michael",
      last_name: "Johnson",
      groups: [],
    },
    {
      id: 4,
      student_number: "1004",
      first_name: "Emily",
      last_name: "Brown",
      groups: [3, 4],
    },
    {
      id: 5,
      student_number: "1005",
      first_name: "David",
      last_name: "Wilson",
      groups: [1],
    },
  ];

  const sampleGroups = [1, 2, 3, 4];

  const fetchStudentsAndGroups = async () => {
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
      // const groupsID = groupsResponse.data.map((group) => group.group_id);

      console.log(groupsResponse.data);
      // setGroups(groupsResponse.data.id);
      setGroups(groupsResponse.data);
      const studentsResponse = await axios.get(
        "http://localhost:3000/api/students",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      console.log(studentsResponse.data);

      // console.log(sampleStudents);
      // const students = studentsResponse.data.map((student) => {});
      setStudents(studentsResponse.data);
    } catch (error) {
      console.error("Error fetching students and groups:", error);
    }
  };

  const addStudent = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  const deleteStudent = async (studentId) => {
    console.log(studentId);
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:3000/api/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setStudents(
        students.filter((student) => student.student_id !== studentId),
      );
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const updateStudent = async (updatedStudent) => {
    console.log(updatedStudent);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.patch(
        `http://localhost:3000/api/students/${updatedStudent.student_id}`,
        updatedStudent,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      setStudents(
        students.map((student) =>
          student.student_id === updatedStudent.student_id
            ? updatedStudent
            : student,
        ),
      );

      closeEditStudentModal();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const manageGroups = () => {
    setIsManageGroupsModalOpen(true);
  };

  const closeManageGroupsModal = () => {
    setIsManageGroupsModalOpen(false);
    fetchStudentsAndGroups();
  };

  const openAddStudentModal = () => {
    setIsAddStudentModalOpen(true);
  };

  const closeAddStudentModal = () => {
    setIsAddStudentModalOpen(false);
    fetchStudentsAndGroups();
  };

  const openEditStudentModal = (student) => {
    setSelectedStudent(student);
    setIsEditStudentModalOpen(true);
  };

  const closeEditStudentModal = () => {
    setIsEditStudentModalOpen(false);
    setSelectedStudent(null);
    fetchStudentsAndGroups();
  };

  useEffect(() => {
    fetchStudentsAndGroups();
  }, []);

  const filteredStudents = students.filter((student) =>
    `${student.first_name} ${student.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <Breadcrumb
        pageName="Students Page"
        description="Manage your student body and groups on the Students Page. You can easily add new students, edit existing ones, and create or delete student groups."
      />

      <section className="relative pb-16 md:pb-20 lg:pb-28">
        <div className="mx-auto max-w-[90%] rounded-lg bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px] md:max-w-[70%] lg:max-w-[90%]">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search students..."
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={manageGroups}
                className="hover:bg-primary-dark mr-2 rounded-lg border border-primary bg-white px-4 py-2 text-primary transition-colors duration-300 focus:outline-none dark:bg-gray-800 dark:text-primary"
              >
                Manage Groups
              </button>
              <button
                onClick={openAddStudentModal}
                className="hover:bg-primary-dark rounded-lg bg-primary px-4 py-2 text-white transition-colors duration-300 focus:outline-none"
              >
                Add Student
              </button>
            </div>
          </div>
          <StudentTable
            students={filteredStudents}
            onDeleteStudent={deleteStudent}
            onEditStudent={openEditStudentModal}
          />
        </div>
      </section>

      <ManageGroupsModal
        isOpen={isManageGroupsModalOpen}
        onClose={closeManageGroupsModal}
        groups={groups}
      />
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={closeAddStudentModal}
        groups={groups}
      />
      <EditStudentModal
        isOpen={isEditStudentModalOpen}
        onClose={closeEditStudentModal}
        student={selectedStudent}
        groups={groups}
        onUpdateStudent={updateStudent}
      />
    </>
  );
};

export default StudentsPage;
