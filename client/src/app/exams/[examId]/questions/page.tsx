"use client";

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import CreateQuestionModal from './CreateQuestionModal';
import GenerateQuestionModal from './GenerateQuestionModal';


const ExamPage = () => {
  const { examId } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([
    { id: 1, name: "Question 1", difficulty: "easy", points: 10, options: ["Option 1", "Option 2", "Option 3"], correctOption: 0 },
    { id: 2, name: "Question 2", difficulty: "medium", points: 15, options: ["Option 1", "Option 2", "Option 3"], correctOption: 1 },
    { id: 3, name: "Question 3", difficulty: "hard", points: 20, options: ["Option 1", "Option 2", "Option 3"], correctOption: 2 },
  ]);
  const [isCreating, setIsCreating] = useState(false);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setIsCreating(false);
  };

  const handleCreateQuestionClick = () => {
    setSelectedQuestion(null);
    setIsCreating(true);
  };


  const handleInputChange = (e, index) => {
    const { name, value, type } = e.target;
    if (name.startsWith("option")) {
      const updatedOptions = [...selectedQuestion.options];
      updatedOptions[index] = value;
      setSelectedQuestion({
        ...selectedQuestion,
        options: updatedOptions
      });
    } else if (type === "radio") {
      setSelectedQuestion({
        ...selectedQuestion,
        [name]: parseInt(value)
      });
    } else {
      setSelectedQuestion({
        ...selectedQuestion,
        [name]: value
      });
    }
  };

  const handleAddOption = () => {
    setSelectedQuestion({
      ...selectedQuestion,
      options: [...selectedQuestion.options, ""]
    });
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = [...selectedQuestion.options];
    updatedOptions.splice(index, 1);
    setSelectedQuestion({
      ...selectedQuestion,
      options: updatedOptions
    });
  };

  const handleUpdateQuestion = (e) => {
    e.preventDefault();
    console.log("Updated Question:", selectedQuestion);
    const updatedQuestions = questions.map(q => q.id === selectedQuestion.id ? selectedQuestion : q);
    setQuestions(updatedQuestions);
  };

  const [isCreateQuestionModalOpen, setCreateQuestionModalOpen] = useState(false);
  const [isGenerateQuestionModalOpen, setGenerateQuestionModalOpen] = useState(false);


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

  const handleCreateQuestion = (questionData) => {
    // Implement logic to handle creating a new question
    console.log("New question data:", questionData);
    // Close the modal after creating the question
    closeCreateQuestionModal();
  };



  return (
    <>
      <section className="relative z-10 py-16 md:py-20 lg:py-28">
        <div className="mx-auto max-w-[90%] rounded-lg bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px] md:max-w-[70%] lg:max-w-[90%]">
          <div className="container mx-auto text-center mb-12">
            <nav className="flex justify-center space-x-4">
              <Link href={`/exams/${examId}/overview`} passHref>
                <span className="text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer">Overview</span>
              </Link>
              <Link href={`/exams/${examId}/questions`} passHref>
                <span className="text-lg font-semibold text-primary hover:text-primary cursor-pointer">Questions</span>
              </Link>
              <Link href={`/exams/${examId}/students`} passHref>
                <span className="text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer">Students</span>
              </Link>
              <Link href={`/exams/${examId}/grading`} passHref>
                <span className="text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer">Grading</span>
              </Link>
              <Link href={`/exams/${examId}/reports`} passHref>
                <span className="text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer">Reports</span>
              </Link>
            </nav>
          </div>
          <div className="container mx-auto p-4 flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 border-r p-4">
              {questions.map((question) => (
                <button
                  key={question.id}
                  onClick={() => handleQuestionClick(question)}
                  className={`w-full p-2 border ${selectedQuestion && selectedQuestion.id === question.id ? 'bg-primary text-white dark:text-white' : 'hover:bg-primary text-blue-700 hover:text-white'} border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800`}
                >
                  {question.name}
                </button>
              ))}
              <button
                onClick={handleCreateQuestionClick}
                className={`w-full p-2 border ${isCreating ? 'bg-primary text-white dark:text-white' : 'hover:bg-primary text-blue-700 hover:text-white'} border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800`}
              >
                Create New Question
              </button>
            </div>
            <div className="w-full md:w-3/4 p-4">
            {selectedQuestion && (
                <form onSubmit={handleUpdateQuestion}>
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="questionName">
                      Question Name
                    </label>
                    <input
                      type="text"
                      id="questionName"
                      name="name"
                      value={selectedQuestion.name}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="difficulty">
                      Difficulty
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={selectedQuestion.difficulty}
                      onChange={handleInputChange}
                      className="w-full p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Options</label>
                    <ul className="mb-4">
                      {selectedQuestion.options.map((option, index) => (
                        <li key={index} className="mb-2 flex items-center">
                          <input
                            type="radio"
                            id={`option${index}`}
                            name="correctOption"
                            value={index}
                            checked={selectedQuestion.correctOption === index}
                            onChange={(e) => handleInputChange(e, index)}
                            className="mr-2 w-4 h-4"
                          />
                          <input
                            type="text"
                            id={`optionText${index}`}
                            name={`option${index}`}
                            value={option}
                            onChange={(e) => handleInputChange(e, index)}
                            className="w-full p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"

                          />
                          <button
                            type="button"
                            className="ml-2 p-2 border rounded bg-gray-200 dark:bg-gray-600 dark:text-white"
                            onClick={() => handleDeleteOption(index)}
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-600 dark:text-white"
                      onClick={handleAddOption}
                    >
                      Add Option
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 w-full p-2 border rounded bg-primary text-white"
                  >
                    Update
                  </button>
                </form>
              )}

              {isCreating && (
                <div>
                  <h2 className="text-2xl mb-4">Create Question</h2>
                  <button
                    onClick={openGenerateQuestionModal}
                    className="block w-full text-left p-2 mb-2 border rounded hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"
                  >
                    Generate Question
                  </button>
                  <button
                    onClick={openCreateQuestionModal}
                    className="block w-full text-left p-2 mb-2 border rounded hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"
                    >
                    Create Question Manually
                  </button>

                  <CreateQuestionModal
                    isOpen={isCreateQuestionModalOpen}
                    onClose={closeCreateQuestionModal}
                    handleCreateQuestion={handleCreateQuestion}
                  />

                  <GenerateQuestionModal
                    isOpen={isGenerateQuestionModalOpen}
                    onClose={closeGenerateQuestionModal}
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

export default ExamPage;