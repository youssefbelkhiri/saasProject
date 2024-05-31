"use client";

import { Metadata } from "next";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { metadata } from "./examsMetadata";



const ExamsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExamName, setNewExamName] = useState("");
    const [message, setMessage] = useState("");

    const exams = [
        { id: 1, name: "Math Exam" },
        { id: 2, name: "Science Exam" },
        { id: 3, name: "History Exam" },
        { id: 4, name: "Geography Exam" },
    ];

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCreateExam = () => {
        setMessage("Exam created successfully!");
        setIsModalOpen(false);
        setNewExamName("");
        // Update the list of exams with the new exam (this is just a sample, normally you would update state)
        exams.push({ id: exams.length + 1, name: newExamName });
    };

    const filteredExams = exams.filter((exam) =>
        exam.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <>
        <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
            <div className="container">
            <div className="flex items-center mb-8 justify-between">
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
                    <li key={exam.id} className="mb-2 hover:bg-background-neutral-subtle"> 
                    <Link href={`/exams/${exam.id}`}>
                        <div
                            className="border-border-divider -sm:border-b -sm:px-4 flex cursor-pointer flex-col gap-2 px-2 py-4 md:flex-row md:items-center md:justify-between md:rounded-lg !opacity-100"
                            role="button"
                            aria-disabled="false"
                            aria-roledescription="draggable"
                        >
                            <div className="flex flex-row gap-3">
                            <Image
                                src="/images/icons/paper-icon.svg"
                                alt="icon"
                                className="select-none !h-5 !w-5"
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
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-2xl">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Create New Exam</h2>
                    <label htmlFor="examName" className="block mb-2 text-gray-700 dark:text-gray-300">Exam Name</label>
                    <input
                        type="text"
                        id="examName"
                        value={newExamName}
                        onChange={(e) => setNewExamName(e.target.value)}
                        className="w-full mb-4 rounded-sm border bg-[#f8f8f8] dark:bg-gray-700 dark:text-gray-200 px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary dark:focus:border-primary"
                    />
                    <label htmlFor="examLanguage" className="block mb-2 text-gray-700 dark:text-gray-300">Language</label>
                    <select
                        id="examLanguage"
                        className="w-full mb-4 rounded-sm border bg-[#f8f8f8] dark:bg-gray-700 dark:text-gray-200 px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary dark:focus:border-primary"
                    >
                        <option value="english">English</option>
                        <option value="french">French</option>
                    </select>
                    <label htmlFor="examDescription" className="block mb-2 text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                        id="examDescription"
                        className="w-full mb-4 rounded-sm border bg-[#f8f8f8] dark:bg-gray-700 dark:text-gray-200 px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary dark:focus:border-primary"
                    ></textarea>
                    <div className="flex justify-end">
                        <button
                        onClick={() => setIsModalOpen(false)}
                        className="mr-4 rounded-sm bg-gray-500 dark:bg-gray-600 dark:text-gray-300 px-6 py-3 text-white duration-300 hover:bg-gray-400 dark:hover:bg-gray-500"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={handleCreateExam}
                        className="rounded-sm bg-primary dark:bg-blue-700 dark:text-gray-100 px-6 py-3 text-white duration-300 hover:bg-primary/90 dark:hover:bg-blue-800"
                        >
                        Create
                        </button>
                    </div>
                    {message && (
                        <div className="mt-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative" role="alert">
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
