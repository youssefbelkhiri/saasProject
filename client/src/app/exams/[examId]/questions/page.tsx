"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CreateQuestionModal from "./CreateQuestionModal";
import GenerateQuestionModal from "./GenerateQuestionModal";
import axios from "axios";
import { useAuth } from "../../../authMiddleware";
import ErrorPage from "@/app/error/page";

const QuestionsPage = () => {
  const { examId } = useParams();
  // const { authToken, userId } = useAuth();
  const authToken = localStorage.getItem('authToken');

  const [message, setMessage] = useState("");
  const [exam, setExam] = useState(null);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [isCreateQuestionModalOpen, setCreateQuestionModalOpen] =
    useState(false);
  const [isGenerateQuestionModalOpen, setGenerateQuestionModalOpen] =
    useState(false);

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchExamAndQuestions = async () => {
      try {
        const examResponse = await axios.get(
          `http://localhost:3000/api/exams/${examId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        const examData = examResponse.data;
        console.log("Exam Data:", examData);

        const updatedQuestions = await Promise.all(
          examData.questions.map(async (question) => {
            const questionResponse = await axios.get(
              `http://localhost:3000/api/questions/${question.question_id}`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              },
            );
            return questionResponse.data;
          }),
        );
        console.log("Updated Questions:", updatedQuestions);
        setQuestions(updatedQuestions);
        setExam(examData);
      } catch (error) {
        console.error("Error fetching exam and questions:", error);
      }
    };
    fetchExamAndQuestions();
  }, [examId, authToken]);

  if (!exam) {
    return <ErrorPage />;
  }

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setIsCreating(false);
  };

  const handleCreateQuestionClick = () => {
    setSelectedQuestion(null);
    setIsCreating(true);
  };

  const handleInputChange = (e, index=0) => {
    const { name, value, type } = e.target;
    if (type === "radio" && name === "correctOption") {
      const updatedOptions = selectedQuestion.options.map((option, i) => ({
        ...option,
        correct: i === parseInt(value),
      }));
      setSelectedQuestion({
        ...selectedQuestion,
        options: updatedOptions,
        correctOption: parseInt(value),
      });
    } else if (name.startsWith("option")) {
      const updatedOptions = selectedQuestion.options.map((option, i) => {
        if (i === index) {
          return { ...option, option: value };
        }
        return option;
      });
      setSelectedQuestion({ ...selectedQuestion, options: updatedOptions });
    } else {
      setSelectedQuestion({ ...selectedQuestion, [name]: value });
    }
  };

  const handleAddOption = () => {
    setSelectedQuestion({
      ...selectedQuestion,
      options: [...selectedQuestion.options, { option: '', correct: false }]
    });
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = selectedQuestion.options.filter(
      (option, i) => i !== index,
    );
    setSelectedQuestion({
      ...selectedQuestion,
      options: updatedOptions,
    });
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();

    const updatedOptions = selectedQuestion.options.map((option, index) => ({
      option_id: option.option_id || undefined,
      optionOrder: index + 1,
      option: option.option,
      correct: index === selectedQuestion.correctOption,
      questionId: parseInt(selectedQuestion.question_id, 10),
    }));

    const updatedQuestionDTO = {
      question_id: parseInt(selectedQuestion.question_id, 10),
      content: selectedQuestion.content,
      difficulty: selectedQuestion.difficulty,
      points: parseInt(selectedQuestion.points, 10),
      exam_id: selectedQuestion.exam_id,
      options: updatedOptions,
    };

    console.log(updatedQuestionDTO);

    try {
      const response = await axios.patch(`http://localhost:3000/api/questions/${selectedQuestion.question_id}`, updatedQuestionDTO, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("Updated Question:", response.data);
      setMessage("Question updated successfully!");

      const updatedQuestions = questions.map(q => q.question_id === selectedQuestion.question_id ? response.data : q);
      setQuestions(updatedQuestions);
    } catch (error) {
      setMessage("Error updating question");
      console.error("Error updating question:", error);
    }
  };
  ;

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/questions/${selectedQuestion.question_id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      const updatedQuestions = questions.filter(
        (q) => q.question_id !== selectedQuestion.question_id,
      );
      setQuestions(updatedQuestions);
      setSelectedQuestion(null);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const openCreateQuestionModal = () => {
    setCreateQuestionModalOpen(true);
  };

  const closeCreateQuestionModal = () => {
    setCreateQuestionModalOpen(false);
  };

  const openGenerateQuestionModal = () => {
    setGenerateQuestionModalOpen(true);
  };

  const closeGenerateQuestionModal = () => {
    setGenerateQuestionModalOpen(false);
  };

  const handleCreateQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
    setCreateQuestionModalOpen(false);
    setSelectedQuestion(newQuestion);
  };

  const updateQuestionList = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };
  

  return (
    <>
      <section className="relative z-10 py-16 md:py-20 lg:py-28">
        <div className="mx-auto max-w-[90%] rounded-lg bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px] md:max-w-[70%] lg:max-w-[90%]">
          <div className="container mx-auto mb-12 text-center">
            <nav className="flex justify-center space-x-4">
              <Link href={`/exams/${examId}/overview`} passHref>
                <span className="cursor-pointer text-lg font-semibold text-black hover:text-primary dark:text-white">
                  Overview
                </span>
              </Link>
              <Link href={`/exams/${examId}/questions`} passHref>
                <span className="cursor-pointer text-lg font-semibold text-primary hover:text-primary">
                  Questions
                </span>
              </Link>
              <Link href={`/exams/${examId}/students`} passHref>
                <span className="cursor-pointer text-lg font-semibold text-black hover:text-primary dark:text-white">
                  Students
                </span>
              </Link>
              <Link href={`/exams/${examId}/grading`} passHref>
                <span className="cursor-pointer text-lg font-semibold text-black hover:text-primary dark:text-white">
                  Grading
                </span>
              </Link>
              <Link href={`/exams/${examId}/reports`} passHref>
                <span className="cursor-pointer text-lg font-semibold text-black hover:text-primary dark:text-white">
                  Reports
                </span>
              </Link>
            </nav>
          </div>
          <div className="container mx-auto flex flex-col p-4 md:flex-row">
            <div className="w-full border-r p-4 md:w-1/4">
              {questions.map((question) => (
                <button
                  key={question.question_id}
                  onClick={() => handleQuestionClick(question)}
                  className={`w-full border p-2 ${selectedQuestion && selectedQuestion.question_id === question.question_id ? "bg-primary text-white dark:text-white" : "text-blue-700 hover:bg-primary hover:text-white"} mb-2 rounded-lg border-blue-700 px-5 py-2.5 text-center font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800`}
                >
                  {question.content}
                </button>
              ))}
              <button
                onClick={handleCreateQuestionClick}
                className={`w-full border p-2 ${isCreating ? "bg-primary text-white dark:text-white" : "text-blue-700 hover:bg-primary hover:text-white"} mb-2 rounded-lg border-blue-700 px-5 py-2.5 text-center font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800`}
              >
                Create New Question
              </button>
            </div>
            <div className="w-full p-4 md:w-3/4">
              {selectedQuestion && (
                <form onSubmit={handleUpdateQuestion}>
                  {message && (
                    <div
                      className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-gray-800 dark:text-green-400"
                      role="alert"
                    >
                      <span className="font-medium">{message}</span>
                      <button
                        type="button"
                        className="ml-4 text-red-500"
                        onClick={() => setMessage('')}
                      >
                        <svg className="text-content-primary text-2xl transition-all text-content-onBrand group-hover:text-content-primary startIcon h-4 w-4 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  )}


                  <div className="mb-4">
                    <label
                      className="mb-2 block text-sm font-bold"
                      htmlFor="questionName"
                    >
                      Question Name
                    </label>
                    <input
                      type="text"
                      id="questionName"
                      name="content"
                      value={selectedQuestion.content}
                      onChange={(e) => handleInputChange(e)}
                      className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="mb-2 block text-sm font-bold"
                      htmlFor="questionPoints"
                    >
                      Points
                    </label>
                    <input
                      type="number"
                      id="questionPoints"
                      name="points"
                      value={selectedQuestion.points}
                      onChange={(e) => handleInputChange(e)}
                      className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="mb-2 block text-sm font-bold"
                      htmlFor="difficulty"
                    >
                      Difficulty
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={selectedQuestion.difficulty}
                      onChange={handleInputChange}
                      className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-bold">
                      Options
                    </label>
                    <ul className="mb-4">
                      {selectedQuestion.options.map((option, index) => (
                        <li key={index} className="mb-2 flex items-center">
                          <input
                              type="hidden"
                              id={`option${index}`}
                              name="option_id"
                              value={index}
                              onChange={(e) => handleInputChange(e)}
                              className="mr-2 w-4 h-4"
                            />
                            <input
                              type="radio"
                              id={`option${index}`}
                              name="correctOption"
                              value={index}
                              checked={option.correct}
                              onChange={(e) => handleInputChange(e, index)}
                              className="mr-2 w-4 h-4"
                            />
                          <input
                            type="text"
                            id={`optionText${index}`}
                            name={`option${index}`}
                            value={option.option}
                            onChange={(e) => handleInputChange(e, index)}
                            className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                          />
                          <button
                            type="button"
                            className="ml-2 rounded border bg-gray-200 p-2 dark:bg-gray-600 dark:text-white"
                            onClick={() => handleDeleteOption(index)}
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="w-full rounded border bg-gray-200 p-2 dark:bg-gray-600 dark:text-white"
                      onClick={handleAddOption}
                    >
                      Add Option
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 w-full rounded border bg-primary p-2 text-white"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="mt-4 w-full rounded border bg-red-500 p-2 text-white"
                    onClick={handleDeleteQuestion}
                  >
                    Delete
                  </button>
                </form>
              )}

              {isCreating && (
                <div>
                  <h2 className="mb-4 text-2xl">Create Question</h2>
                  <button
                    onClick={openGenerateQuestionModal}
                    className="mb-2 block w-full rounded border p-2 text-left hover:bg-gray-200 dark:text-white dark:hover:bg-gray-600"
                  >
                    Generate Question
                  </button>
                  <button
                    onClick={openCreateQuestionModal}
                    className="mb-2 block w-full rounded border p-2 text-left hover:bg-gray-200 dark:text-white dark:hover:bg-gray-600"
                  >
                    Create Question Manually
                  </button>

                  <CreateQuestionModal
                    isOpen={isCreateQuestionModalOpen}
                    onClose={closeCreateQuestionModal}
                    handleCreateQuestion={handleCreateQuestion}
                    examId={examId}
                  />

                  <GenerateQuestionModal
                    isOpen={isGenerateQuestionModalOpen}
                    onClose={closeGenerateQuestionModal}
                    language={exam.language}
                    examId = {examId}
                    updateQuestionList={updateQuestionList}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default QuestionsPage;
