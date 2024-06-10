"use client";

import { Metadata } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { metadata } from "./examsMetadata";

// interface Exam {
//   id: number;
//   name: string;
//   exam_language: string;
//   description: string;
//   exam_time: number;
//   total_point: number;
// }

const ExamsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExamName, setNewExamName] = useState("");
  const [examTime, setExamTime] = useState<number>();
  const [totalPoint, setTotalPoint] = useState<number>();
  const [examLanguage, setExamLanguage] = useState("english");
  const [examDescription, setExamDescription] = useState("");
  const [message, setMessage] = useState("");
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      const response = await axios.get("http://localhost:3000/api/exams", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data);
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateExam = async () => {
    const newExam = {
      name: newExamName,
      exam_language: examLanguage,
      description: examDescription,
      exam_time: examTime,
      total_point: totalPoint,
      user_id: 11,
    };

    try {
      const authToken = localStorage.getItem("authToken");

      const response = await axios.post(
        "http://localhost:3000/api/exams/new",
        newExam,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      console.log("Exam created successfully:", response.data);
      setMessage("Exam created successfully!");
      setIsModalOpen(false);
      setNewExamName("");
      setExamLanguage("english");
      setExamDescription("");
      setExamTime(0);
      setTotalPoint(0);
      setExams([...exams, response.data]);
    } catch (error) {
      console.error("Error creating exam:", error);
      setMessage("Error creating exam.");
    }
  };

  const filteredExams = exams.filter((exam) =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <input
              type="text"
              placeholder="Search exams"
              value={searchTerm}
              onChange={handleSearch}
              className="w-3/5 rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary dark:bg-[#2C303B] dark:focus:border-primary"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-4 rounded-sm bg-primary px-6 py-3 text-white duration-300 hover:bg-primary/90"
            >
              Create Exam
            </button>
          </div>

          <ul className="list-none">
            {filteredExams.map((exam) => (
              <li
                key={exam.id}
                className="hover:bg-background-neutral-subtle mb-2"
              >
                <Link href={`/exams/${exam.id}/overview`}>
                  <div
                    className="border-border-divider -sm:border-b -sm:px-4 flex cursor-pointer flex-col gap-2 px-2 py-4 !opacity-100 md:flex-row md:items-center md:justify-between md:rounded-lg"
                    role="button"
                    aria-disabled="false"
                    aria-roledescription="draggable"
                  >
                    <div className="flex flex-row gap-3">
                      <Image
                        src="/images/icons/paper-icon.svg"
                        alt="icon"
                        className="!h-5 !w-5 select-none"
                        width={140}
                        height={30}
                      />
                      <p className="text-content-primary md:text-md text-sm font-semibold">
                        {exam.name}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {filteredExams.length === 0 && <p>No exams found.</p>}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                Create New Exam
              </h2>
              <label
                htmlFor="examName"
                className="mb-2 block text-gray-700 dark:text-gray-300"
              >
                Exam Name
              </label>
              <input
                type="text"
                id="examName"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                className="mb-4 w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:focus:border-primary"
              />
              <label
                htmlFor="examLanguage"
                className="mb-2 block text-gray-700 dark:text-gray-300"
              >
                Language
              </label>
              <select
                id="examLanguage"
                className="mb-4 w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:focus:border-primary"
              >
                <option value="english">English</option>
                <option value="french">French</option>
              </select>
              <label
                htmlFor="examDescription"
                className="mb-2 block text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="examDescription"
                className="mb-4 w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:focus:border-primary"
              ></textarea>
              <label
                htmlFor="examTime"
                className="mb-2 block text-gray-700 dark:text-gray-300"
              >
                Exam Time
              </label>
              <input
                type="number"
                id="examTime"
                value={examTime}
                onChange={(e) => setExamTime(Number(e.target.value))}
                className="mb-4 w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:focus:border-primary"
              />
              <label
                htmlFor="totalPoint"
                className="mb-2 block text-gray-700 dark:text-gray-300"
              >
                Total Point
              </label>
              <input
                type="number"
                id="totalPoint"
                value={totalPoint}
                onChange={(e) => setTotalPoint(Number(e.target.value))}
                className="mb-4 w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:focus:border-primary"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mr-4 rounded-sm bg-gray-500 px-6 py-3 text-white duration-300 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateExam}
                  className="rounded-sm bg-primary px-6 py-3 text-white duration-300 hover:bg-primary/90 dark:bg-blue-700 dark:text-gray-100 dark:hover:bg-blue-800"
                >
                  Create
                </button>
              </div>
              {message && (
                <div
                  className="relative mt-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700 dark:border-green-700 dark:bg-green-900 dark:text-green-200"
                  role="alert"
                >
                  <span className="block sm:inline">{message}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ExamsPage;
