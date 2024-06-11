"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { metadata } from "./studentsMetadata";
import ErrorPage from "@/app/error/page";
import AddStudentModal from "./AddStudentModal";
import StudentTable from "./StudentTable";
import axios from "axios";

const StudentsPage = () => {
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const { examId } = useParams();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchPaperData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:3000/api/papers/${Number(examId)}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        setPapers(response.data);

        const studentResponse = await axios.get(
          `http://localhost:3000/api/students`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        console.log(studentResponse.data);

        const paperStudentIds = response.data.map((paper) => paper.student_id);

        const filteredStudents = studentResponse.data.filter((student) =>
          paperStudentIds.includes(student.student_id),
        );
        console.log(filteredStudents);
        setStudents(filteredStudents);

        // const paperData = await response.json();
        // const studentIds = paperData.studentIds;

        // const studentsResponse = await fetch(
        //   `/api/students?ids=${studentIds.join(",")}`,
        // );
        // const studentsData = await studentsResponse.json();
        // setStudents(studentsData);

        // const groupsResponse = await fetch(
        //   `/api/groups?studentIds=${studentIds.join(",")}`,
        // );
        // const groupsData = await groupsResponse.json();
        // setGroups(groupsData);

        // setIsLoading(false);
      } catch (error) {
        console.error("Error fetching paper data:", error);
      }
    };

    if (examId) {
      fetchPaperData();
    }
  }, [examId]);

  // const filteredStudents = students.filter((student) =>
  //   `${student.first_name} ${student.last_name}`
  //     .toLowerCase()
  //     .includes(searchQuery.toLowerCase()),
  // );

  const openAddStudentModal = () => {
    setIsAddStudentModalOpen(true);
  };

  const closeAddStudentModal = () => {
    setIsAddStudentModalOpen(false);
  };

  const deleteStudent = async (studentId) => {
    console.log(papers);
    const authToken = localStorage.getItem("authToken");
    const selectedPapers = papers.filter(
      (paper) => paper.student_id === studentId,
    );
    console.log(selectedPapers);

    const selectedPaperIds = selectedPapers.map((paper) => paper.paper_id);
    console.log(selectedPaperIds);

    const response = await axios.delete(
      `http://localhost:3000/api/papers/${selectedPaperIds}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    setStudents(students.filter((student) => student.student_id !== studentId));
  };

  if (!examId) {
    return <ErrorPage />;
  }

  return (
    <>
      <section className="relative z-10 py-16 md:py-20 lg:py-28">
        <div className="mx-auto max-w-[90%] rounded-lg bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px] md:max-w-[70%] lg:max-w-[90%]">
          <div className="container mx-auto mb-12 text-center">
            <nav className="flex justify-center space-x-4">
              <Link href={`/exams/${examId}/overview`} passHref>
                <span
                  className={`cursor-pointer text-lg font-semibold text-black hover:text-primary dark:text-white`}
                >
                  Overview
                </span>
              </Link>
              <Link href={`/exams/${examId}/questions`} passHref>
                <span
                  className={`cursor-pointer text-lg font-semibold text-black hover:text-primary dark:text-white`}
                >
                  Questions
                </span>
              </Link>
              <Link href={`/exams/${examId}/students`} passHref>
                <span
                  className={`cursor-pointer text-lg font-semibold text-primary hover:text-primary`}
                >
                  Students
                </span>
              </Link>
              <Link href={`/exams/${examId}/grading`} passHref>
                <span
                  className={`cursor-pointer text-lg font-semibold text-black hover:text-primary dark:text-white`}
                >
                  Grading
                </span>
              </Link>
              <Link href={`/exams/${examId}/reports`} passHref>
                <span
                  className={`cursor-pointer text-lg font-semibold text-black hover:text-primary dark:text-white`}
                >
                  Reports
                </span>
              </Link>
            </nav>
          </div>

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
                className="hover:bg-primary-dark rounded-lg bg-primary px-4 py-2 text-white transition-colors duration-300 focus:outline-none"
                onClick={openAddStudentModal}
              >
                Add Student to Exam
              </button>
            </div>
          </div>

          <StudentTable students={students} onDeleteStudent={deleteStudent} />
        </div>
      </section>

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={closeAddStudentModal}
        students={students}
        examId={examId}
      />
    </>
  );
};

export default StudentsPage;
