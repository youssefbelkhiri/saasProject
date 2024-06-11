import React, { useState } from "react";
import axios from "axios";

interface CreateOptionDto {
  optionOrder: number;
  option: string;
  correct: boolean;
}

interface CreateQuestionDto {
  questionOrder: number;
  content: string;
  difficulty: string;
  points: number;
  options: CreateOptionDto[];
  exam_id: number;
}

const CreateQuestionModal = ({
  isOpen,
  onClose,
  updateQuestionList,
  examId,
}) => {
  const [questionData, setQuestionData] = useState<CreateQuestionDto>({
    questionOrder: 1,
    content: "",
    difficulty: "easy",
    points: 1,
    options: [
      { optionOrder: 0, option: "", correct: false },
      { optionOrder: 1, option: "", correct: false },
    ],
    exam_id: Number(examId),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
  ) => {
    const { name, value, type } = e.target;
    if (index !== undefined && name.startsWith("option")) {
      const updatedOptions = [...questionData.options];
      updatedOptions[index] = { ...updatedOptions[index], option: value };
      setQuestionData({
        ...questionData,
        options: updatedOptions,
      });
    } else if (type === "radio") {
      const updatedOptions = questionData.options.map((option, idx) => ({
        ...option,
        correct: idx === parseInt(value),
      }));
      setQuestionData({
        ...questionData,
        options: updatedOptions,
      });
    } else {
      setQuestionData({
        ...questionData,
        [name]: type === "number" ? Number(value) : value,
      });
    }
  };

  const handleAddOption = () => {
    const newOption: CreateOptionDto = {
      optionOrder: questionData.options.length,
      option: "",
      correct: false,
    };
    setQuestionData({
      ...questionData,
      options: [...questionData.options, newOption],
    });
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = questionData.options.filter((_, i) => i !== index);
    setQuestionData({
      ...questionData,
      options: updatedOptions.map((option, idx) => ({
        ...option,
        optionOrder: idx,
      })),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(questionData);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:3000/api/questions",
        questionData,

        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      updateQuestionList({
        ...questionData,
        question_id: response.data.question_id,
      });

      // handleCreateQuestion(response.data);
      setQuestionData({
        questionOrder: 0,
        content: "",
        difficulty: "easy",
        points: 1,
        options: [
          { optionOrder: 0, option: "", correct: false },
          { optionOrder: 1, option: "", correct: false },
        ],
        exam_id: Number(examId),
      });
      onClose();
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[1000] overflow-y-auto ${isOpen ? "block" : "hidden"}`}
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-dark">
          <button
            className="absolute right-0 top-0 mr-4 mt-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="mb-4 text-2xl font-bold">Create Question Manually</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold" htmlFor="content">
                Question Content
              </label>
              <input
                type="text"
                id="content"
                name="content"
                value={questionData.content}
                onChange={handleChange}
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
                value={questionData.difficulty}
                onChange={handleChange}
                className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold" htmlFor="points">
                Points
              </label>
              <input
                type="number"
                id="points"
                name="points"
                value={questionData.points}
                onChange={handleChange}
                className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold" htmlFor="points">
                Question order
              </label>
              <input
                type="number"
                id="questionOrder"
                name="questionOrder"
                // value={questionData.questionOrder}
                onChange={handleChange}
                className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold">Options</label>
              <ul className="mb-4">
                {questionData.options.map((option, index) => (
                  <li key={index} className="mb-2 flex items-center">
                    <label htmlFor={`option${index}`} className="custom-radio">
                      <input
                        type="radio"
                        id={`option${index}`}
                        name="correctOption"
                        value={index}
                        checked={option.correct}
                        onChange={(e) => handleChange(e, index)}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="radio-btn"></span>
                    </label>
                    <input
                      type="text"
                      id={`optionText${index}`}
                      name={`option${index}`}
                      value={option.option}
                      onChange={(e) => handleChange(e, index)}
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
              className="w-full rounded border bg-primary p-2 text-white"
            >
              Create
            </button>
            <button
              className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white"
              onClick={onClose}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionModal;
