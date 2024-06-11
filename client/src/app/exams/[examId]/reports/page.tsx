"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from "recharts";
import ErrorPage from "@/app/error/page";
import axios from "axios";

interface StatsData {
  result: any[];
  gradeCounts: Record<string, number>;
}

const fetchExams = async (examId) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await axios.get("http://localhost:3000/api/exams", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log(response.data);
    return response.data.find((exam) => exam.exam_id === parseInt(examId));
    // setExams(response.data);
  } catch (error) {
    console.error("Error fetching exams:", error);
  }
};

export const fetchStatistics = async (examId) => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await axios.post(
      "http://localhost:3000/api/reports/statistics",
      { exam_id: examId },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
};

const ReportsPage = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [reportData, setReportData] = useState<StatsData>();

  useEffect(() => {
    const fetchData = async () => {
      if (examId) {
        const examData = await fetchExams(examId);
        setExam(examData);

        if (examData) {
          const statsData = await fetchStatistics(Number(examId));
          console.log(statsData);
          setReportData(statsData);
        }
      }
    };

    fetchData();
  }, [examId]);

  useEffect(() => {
    console.log("Updated report data:", reportData);
  }, [reportData]);

  if (!exam || !reportData) {
    return <ErrorPage />;
  }

  console.log(reportData);

  const gradeCounts = Object.keys(reportData.gradeCounts).map((grade) => ({
    name: grade,
    count: reportData.gradeCounts[grade],
  }));

  const gradeCountsPie = Object.keys(reportData.gradeCounts).map((grade) => ({
    name: grade,
    value: reportData.gradeCounts[grade],
  }));

  const notesStats = [
    { name: "Min", note: parseFloat(reportData.result[0]._min.note) },
    { name: "Avg", note: parseFloat(reportData.result[0]._avg.note) },
    { name: "Max", note: parseFloat(reportData.result[0]._max.note) },
  ];

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
                  className={`cursor-pointer text-lg font-semibold text-black hover:text-primary dark:text-white`}
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
                  className={`cursor-pointer text-lg font-semibold text-primary hover:text-primary`}
                >
                  Reports
                </span>
              </Link>
            </nav>
          </div>
          <div className="container mx-auto p-4">
            <div className="-mx-4 flex flex-wrap">
              <div className="my-8 w-full px-4 lg:w-1/2">
                <h2 className="mb-4 text-2xl font-bold">Grade Distribution</h2>
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
              <div className="my-8 w-full px-4 lg:w-1/2">
                <h2 className="mb-4 text-2xl font-bold">Notes Statistics</h2>
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
              <div className="my-8 w-full px-4 lg:w-1/2">
                <h2 className="mb-4 text-2xl font-bold">Grade Percentage</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={gradeCountsPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {gradeCountsPie.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#8884d8",
                              "#83a6ed",
                              "#8dd1e1",
                              "#82ca9d",
                              "#a4de6c",
                              "#d0ed57",
                              "#ffc658",
                            ][index % 7]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="my-8 w-full px-4 lg:w-1/2">
                <h2 className="mb-4 text-2xl font-bold">
                  Grade Distribution Radar
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={gradeCounts}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Radar
                      dataKey="count"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
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
