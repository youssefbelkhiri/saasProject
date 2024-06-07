import React, { useState } from 'react';

const GenerateQuestionModal = ({ isOpen, onClose }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerateClick = () => {
    const generatedQuestions = [
      {
        content: "When did the Tokugawa Shogunate fall?",
        options: [
          { option: "1868", correct: true },
          { option: "1867", correct: false },
          { option: "1866", correct: false },
          { option: "1865", correct: false }
        ]
      },
      {
        content: "Which Japanese emperor was known as the 'Meiji Restoration Emperor'?",
        options: [
          { option: "Meiji", correct: true },
          { option: "Yoshihito", correct: false },
          { option: "Hirohito", correct: false },
          { option: "Akito", correct: false }
        ]
      },
      {
        content: "Which of the following was not a part of the 'Big Three' of the Pacific War?",
        options: [
          { option: "Japan", correct: false },
          { option: "United States", correct: true },
          { option: "United Kingdom", correct: false },
          { option: "China", correct: false }
        ]
      },
      {
        content: "Which of the following was not a major city of the Edo period?",
        options: [
          { option: "Kyoto", correct: false },
          { option: "Tokyo", correct: false },
          { option: "Osaka", correct: true },
          { option: "Nagoya", correct: false }
        ]
      },
      {
        content: "What was the name of the first shogun of the Tokugawa Shogunate?",
        options: [
          { option: "Toyotomi Hideyoshi", correct: false },
          { option: "Ieyasu Tokugawa", correct: true },
          { option: "Napoleon Bonaparte", correct: false },
          { option: "Oda Nobunaga", correct: false }
        ]
      },
      {
        content: "Which of the following was not a major religion in Japan during the Edo period?",
        options: []
      },
      {
        content: "What was the name of the Japanese battleship that was sunk at the Battle of Midway?",
        options: [
          { option: "Akagi", correct: true },
          { option: "Kaga", correct: false },
          { option: "Hiryu", correct: false }
        ]
      }
    ];
    setQuestions(generatedQuestions);
    setIsGenerated(true);
  };

  const handleBackClick = () => {
    setIsGenerated(false);
    setQuestions(null);
  };

  return (
    <div className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
        <div className="relative bg-white p-6 rounded-lg shadow-xl dark:bg-dark flex overflow-y-auto overflow-x-hidden fixed justify-center items-center w-4/5 max-w-7xl mx-auto z-20">
          <div className="flex w-full">
            <div className={`flex-1 ${isGenerated ? 'overflow-y-auto' : ''}`}>
              <div className="flex w-full items-center justify-between">
                <p className="m-0 text-md text-content-primary font-semibold dark:text-white">Questions generator</p>
                {isGenerated && (
                  <button className="flex items-center mr-3 text-blue-500 ml-2" onClick={handleBackClick}>
                    <img src="https://img.icons8.com/?size=100&id=39944&format=png&color=000000" style={{ height: '32px' }}/>
                    Back
                  </button>
                )}
              </div>
              <div className="flex flex-col mt-6" style={{ height: '400px' }}>
                {questions ? (
                  <div>
                    {questions.map((question, index) => (
                      <div key={index} className="mb-4 mr-4 before:rounded p-4 border-stroke border bg-[#f8f8f8] focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary">
                        <p className="text-content-primary dark:text-white font-semibold">Question {index + 1}: {question.content}</p>
                        <div className="mt-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="ml-4 flex items-center">
                              <span className={`text-body-color dark:text-body-color-dark ${option.correct ? 'text-green-500 font-semibold' : ''}`}>
                                {option.option}
                              </span>
                              {option.correct && <svg className="h-5 w-5 text-green-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>}
                            </div>
                          ))}
                        </div>
                        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => console.log("Add to exam")}>Add to Exam</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <label className="label text-content-primary mb-1 select-none text-sm font-medium dark:text-white" htmlFor="context">
                      Context
                    </label>
                    <div className="input-wrapper bg-background-form hover:bg-background-form-hover relative flex rounded-lg transition-[colors_border-color]">
                      <textarea
                        id="context"
                        className="min-h-[40px] max-h-[400px] w-full p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none overflow-auto"
                        placeholder="Enter question context here..."
                        style={{ height: '360px' }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="w-1/3 bg-background-neutral-subtle dark:bg-gray-700 p-6 ml-6 rounded-lg flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <p className="m-0 text-md text-content-primary font-semibold dark:text-white">Difficulty</p>
                  <div className="mt-2 flex gap-2">
                    <button className={`w-p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-${selectedDifficulty === 'Easy' ? 'primary text-white dark:bg-primary dark:text-white' : '#f8f8f8'} px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none`} onClick={() => setSelectedDifficulty('Easy')}>Easy</button>
                    <button className={`w-p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-${selectedDifficulty === 'Medium' ? 'primary text-white dark:bg-primary dark:text-white' : '#f8f8f8'} px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none`} onClick={() => setSelectedDifficulty('Medium')}>Medium</button>
                    <button className={`w-p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-${selectedDifficulty === 'Hard' ? 'primary text-white dark:bg-primary dark:text-white' : '#f8f8f8'} px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none`} onClick={() => setSelectedDifficulty('Hard')}>Hard</button>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="m-0 text-md text-content-primary font-semibold dark:text-white">Number of options</p>
                  <div className="mt-2 flex gap-2">
                    {[2, 3, 4, 5, 6].map(option => (
                      <button key={option} className={`w-p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-${selectedOption === option ? 'primary  text-white dark:bg-primary dark:text-white' : '#f8f8f8'} px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none`} onClick={() => setSelectedOption(option)}>{option}</button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="m-0 text-md text-content-primary font-semibold dark:text-white">Points</p>
                  <input
                    type="number"
                    className="w-full p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    placeholder="Enter points"
                  />
                </div>
              </div>
              <button className="w-full p-2 border rounded bg-primary text-white mt-auto" onClick={handleGenerateClick}>
                Generate
              </button>
            </div>
            <button
              type="button"
              className="absolute top-6 right-6 text-content-primary bg-background-default focus-visible:border-border-brand hover:bg-action-hover-ghost cursor-pointer select-none p-0 outline-0 transition-[background-color_shadow] active:outline-0 sm:transition-all flex items-center justify-center gap-2 rounded-lg px-3 py-2 bg-transparent hover:bg-action-hover-ghost dark:text-white"
              onClick={onClose}
            >
              <svg className="text-content-primary text-2xl transition-all text-content-onBrand group-hover:text-content-primary startIcon h-4 w-4 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="m-0 text-content-onBrand text group-hover:text-content-primary whitespace-nowrap font-semibold transition-[color] dark:text-white">Close</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateQuestionModal;

