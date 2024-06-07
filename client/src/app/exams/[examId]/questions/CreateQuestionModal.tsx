import React, { useState } from 'react';

const CreateQuestionModal = ({ isOpen, onClose, handleCreateQuestion }) => {
  const [questionData, setQuestionData] = useState({
    name: '',
    difficulty: 'easy',
    options: ['', ''],
    correctOption: null
  });

  const handleChange = (e, index) => {
    const { name, value, type } = e.target;
    if (name.startsWith("option")) {
      const updatedOptions = [...questionData.options];
      updatedOptions[index] = value;
      setQuestionData({
        ...questionData,
        options: updatedOptions
      });
    } else if (type === "radio") {
      setQuestionData({
        ...questionData,
        [name]: parseInt(value)
      });
    } else {
      setQuestionData({
        ...questionData,
        [name]: value
      });
    }
  };

  const handleAddOption = () => {
    setQuestionData({
      ...questionData,
      options: [...questionData.options, '']
    });
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = [...questionData.options];
    updatedOptions.splice(index, 1);
    setQuestionData({
      ...questionData,
      options: updatedOptions
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call handleCreateQuestion function from parent component
    handleCreateQuestion(questionData);
    // Reset form data
    setQuestionData({
      name: '',
      difficulty: 'easy',
      options: ['', ''],
      correctOption: null
    });
  };

  return (
    <div className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
        <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl dark:bg-dark">
          <button className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold mb-4">Create Question Manually</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="questionName">
                Question Name
              </label>
              <input
                type="text"
                id="questionName"
                name="name"
                value={questionData.name}
                onChange={handleChange}
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
                value={questionData.difficulty}
                onChange={handleChange}
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
                {questionData.options.map((option, index) => (
                  <li key={index} className="mb-2 flex items-center">
                  <label htmlFor={`option${index}`} className="custom-radio">
                    <input
                      type="radio"
                      id={`option${index}`}
                      name="correctOption"
                      value={index}
                      checked={questionData.correctOption === index}
                      onChange={(e) => handleChange(e, index)}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="radio-btn"></span>
                  </label>
                  <input
                    type="text"
                    id={`optionText${index}`}
                    name={`option${index}`}
                    value={option}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  <button
                    type="button"
                    className="ml-2 p-2 border rounded bg-gray-200  dark:bg-gray-600 dark:text-white"
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
              className="w-full p-2 border rounded bg-primary text-white"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>

  );
};

export default CreateQuestionModal;
