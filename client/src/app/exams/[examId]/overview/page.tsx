"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ErrorPage from '@/app/error/page';
import axios from 'axios';
import { useAuth } from "../../../authMiddleware";

const OverviewPage = () => {
  const { authToken, userId } = useAuth();
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    exam_language: "English",
    description: "",
    total_point: "",
    exam_time: ""
  });

  useEffect(() => {
    if (examId) {
      axios.get(`http://localhost:3000/api/exams/${examId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      .then(response => {
        setExam(response.data);
        setFormData({
          name: response.data.name,
          exam_language: response.data.exam_language,
          description: response.data.description,
          total_point: response.data.total_point,
          exam_time: response.data.exam_time,
        });
      })
      .catch(error => {
        console.error('Error fetching exam data:', error);
      });
    }
  }, [examId, authToken]);

  if (!exam) {
    return <ErrorPage />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      name: formData.name,
      exam_language: formData.exam_language,
      description: formData.description,
      exam_time: parseInt(formData.exam_time),
      total_point: parseInt(formData.total_point),
      user_id: userId
    };


    console.log(updatedFormData);
    try {
      await axios.patch(`http://localhost:3000/api/exams/${examId}`, updatedFormData, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setMessage("Exam updated successfully!");
    } 
    catch (error) {
      console.error('Error updating exam:', error);
      setMessage('Error updating exam');
    }
  };

  const currentPath = typeof window !== "undefined" ? window.location.hash : '';

  return (
    <>
      <section className="relative z-10 py-16 md:py-20 lg:py-28">
        <div className="mx-auto max-w-[90%] rounded-lg bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px] md:max-w-[70%] lg:max-w-[90%]">
          <div className="container mx-auto text-center mb-12">
            <nav className="flex justify-center space-x-4">
              <Link href={`/exams/${examId}/overview`} passHref>
                <span className={`text-lg font-semibold text-primary hover:text-primary cursor-pointer`}>Overview</span>
              </Link>
              <Link href={`/exams/${examId}/questions`} passHref>
                <span className={`text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer`}>Questions</span>
              </Link>
              <Link href={`/exams/${examId}/students`} passHref>
                <span className={`text-lg font-semibold ${currentPath === `/exams/${examId}/students` ? 'text-primary' : 'text-black dark:text-white'} hover:text-primary cursor-pointer`}>Students</span>
              </Link>
              <Link href={`/exams/${examId}/grading`} passHref>
                <span className={`text-lg font-semibold ${currentPath === `/exams/${examId}/grading` ? 'text-primary' : 'text-black dark:text-white'} hover:text-primary cursor-pointer`}>Grading</span>
              </Link>
              <Link href={`/exams/${examId}/reports`} passHref>
                <span className={`text-lg font-semibold ${currentPath === `/exams/${examId}/reports` ? 'text-primary' : 'text-black dark:text-white'} hover:text-primary cursor-pointer`}>Reports</span>
              </Link>
            </nav>
          </div>

          <div className="container mx-auto p-4 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
              <form onSubmit={handleSubmit}>
                {message && (
                  <div
                    className="mb-4 relative mt-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700 dark:border-green-700 dark:bg-green-900 dark:text-green-200"
                    role="alert"
                  >
                    <span className="block sm:inline">{message}</span>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2" htmlFor="name">
                    Exam Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2" htmlFor="exam_language">
                    Language
                  </label>
                  <select
                    id="exam_language"
                    name="exam_language"
                    value={formData.exam_language}
                    onChange={handleChange}
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    required
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2" htmlFor="total_point">
                    Total Points
                  </label>
                  <input
                    type="number"
                    id="total_point"
                    name="total_point"
                    value={formData.total_point}
                    onChange={handleChange}
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2" htmlFor="exam_time">
                    Exam Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="exam_time"
                    name="exam_time"
                    value={formData.exam_time}
                    onChange={handleChange}
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    required
                  />
                </div>
                <button type="submit" className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
                  Update
                </button>
              </form>
            </div>

            <div className="w-full md:w-1/2 flex justify-center ">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className='text-content-secondary flex items-center gap-1.5 p-1.5'>
                    <svg className="text-md" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M8 9h8"></path>
                      <path d="M8 13h6"></path>
                      <path d="M14 18h-1l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5"></path>
                      <path d="M19 22v.01"></path>
                      <path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path>
                    </svg>
                    <p className="text-lg font-bold">Questions</p>
                  </div>
                  <span className="text-lg">{exam ? `${exam.questions.length} questions` : '0'}</span>
                  </div>
                <div className="flex items-center gap-2">
                  <div className='text-content-secondary flex items-center gap-1.5 p-1.5'>
                    <svg className="text-md" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                      <path d="M16 5l3 3"></path>
                    </svg>
                    <p className="text-lg font-bold">Graded</p>
                  </div>
                  <span className="text-lg">0 out of 20</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className='text-content-secondary flex items-center gap-1.5 p-1.5'>
                    <svg className="text-md" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                    </svg>
                    <p className="text-lg font-bold">Points</p>
                  </div>
                  <span className="text-lg">{exam ? exam.total_point : '0'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className='text-content-secondary flex items-center gap-1.5 p-1.5'>
                    <svg className="text-md" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"></path>
                      <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"></path>
                    </svg>
                    <p className="text-lg font-bold">Students</p>
                  </div>
                  <span className="text-lg">20 students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OverviewPage;
