"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { metadata } from "./reportsMetadata";
import ErrorPage from '@/app/error/page';

const fetchExamData = async (examId: any) => {
  const exams = [
    { id: 1, name: "Math Exam", language: "English", description: "A comprehensive math exam." },
    { id: 2, name: "Science Exam", language: "English", description: "A comprehensive science exam." },
    { id: 3, name: "History Exam", language: "French", description: "A comprehensive history exam." },
    { id: 4, name: "Geography Exam", language: "French", description: "A comprehensive geography exam." },
  ];

  return exams.find(exam => exam.id === parseInt(examId));
};

const ExamPage = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    if (examId) {
      fetchExamData(examId).then(data => setExam(data));
    }
  }, [examId]);

  if (!exam) {
    return <ErrorPage />;
  }

  const currentPath = typeof window !== "undefined" ? window.location.hash : '';

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
              <span className={`text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer`}>Students</span>
            </Link>
            <Link href={`/exams/${examId}/grading`} passHref>
              <span className={`text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer`}>Grading</span>
            </Link>
            <Link href={`/exams/${examId}/reports`} passHref>
              <span className={`text-lg font-semibold text-primary  hover:text-primary cursor-pointer`}>Reports</span>
            </Link>
          </nav>
        </div>
        <div className="container mx-auto p-4">
          <p>Reports Page</p>
          <h1 className="text-3xl font-bold mb-4">{exam.name}</h1>
          <p><strong>Language:</strong> {exam.language}</p>
          <p><strong>Description:</strong> {exam.description}</p>
        </div>
      </div>
    </section>
  </>

  );
};

export default ExamPage;
