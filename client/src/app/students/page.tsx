"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ManageGroupsModal from "./ManageGroupsModal";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import StudentTable from "./StudentTable";

const StudentsPage = () => {
  const [isManageGroupsModalOpen, setIsManageGroupsModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sampleStudents = [
    { id: 1, studentNumber: "1001", firstName: "John", lastName: "Doe", groups: ["Group A", "Group B"] },
    { id: 2, studentNumber: "1002", firstName: "Jane", lastName: "Smith", groups: ["Group B"] },
    { id: 3, studentNumber: "1003", firstName: "Michael", lastName: "Johnson", groups: [] },
    { id: 4, studentNumber: "1004", firstName: "Emily", lastName: "Brown", groups: ["Group C", "Group D"] },
    { id: 5, studentNumber: "1005", firstName: "David", lastName: "Wilson", groups: ["Group A"] },
  ];

  const sampleGroups = ["Group A", "Group B", "Group C", "Group D"];

  const fetchStudentsAndGroups = () => {
    setStudents(sampleStudents);
    setGroups(sampleGroups);
  };

  const addStudent = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  const deleteStudent = (studentId) => {
    setStudents(students.filter((student) => student.id !== studentId));
  };

  const updateStudent = (updatedStudent) => {
    setStudents(students.map((student) => (student.id === updatedStudent.id ? updatedStudent : student)));
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
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Breadcrumb
        pageName="Students Page"
        description="Manage your student body and groups on the Students Page. You can easily add new students, edit existing ones, and create or delete student groups."
      />

      <section className="relative pb-16 md:pb-20 lg:pb-28">
        <div className="mx-auto max-w-[90%] rounded-lg bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px] md:max-w-[70%] lg:max-w-[90%]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search students..."
                className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-primary dark:bg-gray-800 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={manageGroups}
                className="mr-2 bg-white border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300 focus:outline-none dark:bg-gray-800 dark:text-primary"
              >
                Manage Groups
              </button>
              <button
                onClick={openAddStudentModal}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300 focus:outline-none"
              >
                Add Student
              </button>
            </div>
          </div>
          <StudentTable students={filteredStudents} onDeleteStudent={deleteStudent} onEditStudent={openEditStudentModal} />
        </div>
      </section>

      <ManageGroupsModal isOpen={isManageGroupsModalOpen} onClose={closeManageGroupsModal} groups={groups} />
      <AddStudentModal isOpen={isAddStudentModalOpen} onClose={closeAddStudentModal} groups={groups} />
      <EditStudentModal isOpen={isEditStudentModalOpen} onClose={closeEditStudentModal} student={selectedStudent} onUpdateStudent={updateStudent} />
    </>
  );
};

export default StudentsPage;
