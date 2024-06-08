"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  LineChart, Line, ResponsiveContainer, PieChart, Pie, Radar, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,Cell 
} from 'recharts';
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

const ReportsPage = () => {
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

  const reportData = {
    "result": [
      {
        "_min": {
          "note": "1"
        },
        "_avg": {
          "note": "9.35"
        },
        "_max": {
          "note": "18"
        },
        "exam_id": 1
      }
    ],
    "gradeCounts": {
      "Non validé": 9,
      "Passable": 3,
      "Assez bien": 3,
      "Bien": 3,
      "Très bien": 0,
      "Excellent": 2
    }
  };

  const gradeCounts = Object.keys(reportData.gradeCounts).map(grade => ({
    name: grade,
    count: reportData.gradeCounts[grade]
  }));

  const gradeCountsPie = Object.keys(reportData.gradeCounts).map(grade => ({
    name: grade,
    value: reportData.gradeCounts[grade]
  }));

  const notesStats = [
    { name: 'Min', note: parseFloat(reportData.result[0]._min.note) },
    { name: 'Avg', note: parseFloat(reportData.result[0]._avg.note) },
    { name: 'Max', note: parseFloat(reportData.result[0]._max.note) }
  ];

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
              <span className={`text-lg font-semibold text-primary hover:text-primary cursor-pointer`}>Reports</span>
            </Link>
          </nav>
        </div>
        <div className="container mx-auto p-4">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-1/2 px-4 my-8">
              <h2 className="text-2xl font-bold mb-4">Grade Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={gradeCounts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 px-4 my-8">
              <h2 className="text-2xl font-bold mb-4">Notes Statistics</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={notesStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="note" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 px-4 my-8">
              <h2 className="text-2xl font-bold mb-4">Grade Percentage</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={gradeCountsPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {
                      gradeCountsPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'][index % 7]} />
                      ))
                    }
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 px-4 my-8">
              <h2 className="text-2xl font-bold mb-4">Grade Distribution Radar</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={gradeCounts}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Radar dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
  );
};

export default ReportsPage;
