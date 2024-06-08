"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { metadata } from "./studentsMetadata";
import ErrorPage from '@/app/error/page';
import AddStudentModal from "./AddStudentModal";
import StudentTable from "./StudentTable";

const StudentsPage = () => {
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { examId } = useParams();
  const [groups, setGroups] = useState([]);


  useEffect(() => {
    const sampleStudents = [
      { id: 1, studentNumber: "1001", firstName: "John", lastName: "Doe", groups: ["Group A", "Group B"] },
      { id: 2, studentNumber: "1002", firstName: "Jane", lastName: "Smith", groups: ["Group B"] },
      { id: 3, studentNumber: "1003", firstName: "Michael", lastName: "Johnson", groups: [] },
      { id: 4, studentNumber: "1004", firstName: "Emily", lastName: "Brown", groups: ["Group C", "Group D"] },
      { id: 5, studentNumber: "1005", firstName: "David", lastName: "Wilson", groups: ["Group A"] },
    ];
    setStudents(sampleStudents);
  }, []);

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddStudentModal = () => {
    setIsAddStudentModalOpen(true);
  };

  const closeAddStudentModal = () => {
    setIsAddStudentModalOpen(false);
  };

  const deleteStudent = (studentId) => {
    setStudents(students.filter((student) => student.id !== studentId));
  };


  if (!examId) {
    return <ErrorPage />;
  }

  return (
    <>
      <section className="relative z-10 py-16 md:py-20 lg:py-28">
        <div className="mx-auto max-w-[90%] rounded-lg bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px] md:max-w-[70%] lg:max-w-[90%]">
          <div className="container mx-auto text-center mb-12">
            <nav className="flex justify-center space-x-4">
              <Link href={`/exams/${examId}/overview`} passHref>
                <span className={`text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer`}>Overview</span>
              </Link>
              <Link href={`/exams/${examId}/questions`} passHref>
                <span className={`text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer`}>Questions</span>
              </Link>
              <Link href={`/exams/${examId}/students`} passHref>
                <span className={`text-lg font-semibold text-primary hover:text-primary cursor-pointer`}>Students</span>
              </Link>
              <Link href={`/exams/${examId}/grading`} passHref>
                <span className={`text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer`}>Grading</span>
              </Link>
              <Link href={`/exams/${examId}/reports`} passHref>
                <span className={`text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer`}>Reports</span>
              </Link>
            </nav>
          </div>

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
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300 focus:outline-none"
                onClick={openAddStudentModal}

              >
                Add Student to Exam
              </button>
            </div>
          </div>

          <StudentTable students={filteredStudents} onDeleteStudent={deleteStudent} />
        </div>
      </section>

      <AddStudentModal isOpen={isAddStudentModalOpen} onClose={closeAddStudentModal} groups={groups} />
      </>
  );
};

export default StudentsPage;
