"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Oval, ColorRing } from "react-loader-spinner";

const GradingPage = () => {
  const [papers, setPapers] = useState([]);
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchExamData = async (examId) => {
    // Your code to fetch exam data
  };

  useEffect(() => {
    if (examId) {
      fetchExamData(examId).then((data) => setExam(data));
    }
  }, [examId]);

  useEffect(() => {
    const fetchPaperData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        const response = await axios.get(
          `http://localhost:3000/api/papers/${Number(examId)}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        setPapers(response.data);

        // Fetch all students
        const studentResponse = await axios.get(
          `http://localhost:3000/api/students`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        const paperStudentIds = response.data.map((paper) => paper.student_id);

        const filteredStudents = studentResponse.data.filter((student) =>
          paperStudentIds.includes(student.student_id),
        );

        setStudents(filteredStudents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (examId) {
      fetchPaperData();
    }
  }, [examId]);

  const handleGradePaper = async (paperId) => {
    const file = uploadedFiles[paperId];
    console.log(paperId);
    console.log("file " + file);

    try {
      setLoading(true);

      const authToken = localStorage.getItem("authToken");
      const fileFormData = new FormData();
      fileFormData.append("file", file);
      console.log(fileFormData);

      const uploadResponse = await axios.patch(
        `http://localhost:3000/api/papers/upload/${paperId}`,
        fileFormData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Paper ID:", uploadResponse.data.paper_id);

      // Send grading request
      const gradingDto = {
        exam_id: Number(examId),
        paper_id: paperId,
      };

      const gradingResponse = await axios.post(
        `http://localhost:3000/api/grading`,
        gradingDto,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      console.log("Grading Response:", gradingResponse.data);

      // Update the note in the papers state
      setPapers((prevPapers) =>
        prevPapers.map((paper) =>
          paper.paper_id === paperId
            ? { ...paper, note: gradingResponse.data.note }
            : paper,
        ),
      );
    } catch (error) {
      console.error("Error grading paper:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (paperId, file) => {
    console.log(file);
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [paperId]: file,
    }));
  };

  const filteredStudents = students.filter((student) =>
    papers.some((paper) => paper.student_id === student.student_id),
  );

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30">
          <ColorRing
            height={80}
            width={80}
            visible={true}
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      )}
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
                  className={`cursor-pointer text-lg font-semibold text-primary hover:text-primary`}
                >
                  Grading
                </span>
              </Link>
              <Link href={`/exams/${examId}/reports`} passHref>
                <span
                  className={`cursor-pointer text-lg font-semibold text-black hover:text-primary dark:text-white`}
                >
                  Reports
                </span>
              </Link>
            </nav>
          </div>
          <div className="container mx-auto p-4">
            <input
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white"
            />

            <table className="mt-4 w-full">
              <thead className="bg-gray-100 uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-100">
                <tr>
                  <th className="border px-4 py-2">Student Number</th>
                  <th className="border px-4 py-2">First Name</th>
                  <th className="border px-4 py-2">Last Name</th>
                  <th className="border px-4 py-2">Import Paper</th>
                  <th className="border px-4 py-2">Grade Paper</th>
                  <th className="border px-4 py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const studentPapers = papers.filter(
                    (paper) => paper.student_id === student.student_id,
                  );
                  return studentPapers.map((paper) => (
                    <tr key={paper.paper_id}>
                      <td className="border px-4 py-2">
                        {student.student_number}
                      </td>
                      <td className="border px-4 py-2">{student.first_name}</td>
                      <td className="border px-4 py-2">{student.last_name}</td>
                      <td className="border px-4 py-2">
                        <DropzoneComponent
                          paperId={paper.paper_id}
                          handleFileUpload={handleFileUpload}
                          fileName={paper.paper || ""}
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleGradePaper(paper.paper_id)}
                          className="hover:bg-primary-dark mr-2 rounded-lg border border-primary bg-white px-4 py-2 text-primary transition-colors duration-300 focus:outline-none dark:bg-gray-800 dark:text-primary"
                        >
                          Grade Paper
                        </button>
                      </td>
                      <td className="border px-4 py-2">
                        {paper.note != -1 ? paper.note : "-"}
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

const DropzoneComponent = ({ paperId, handleFileUpload, fileName }) => {
  const [displayFileName, setDisplayFileName] = useState(fileName);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    handleFileUpload(paperId, file);
    setDisplayFileName(file.name);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div
      {...getRootProps({
        className:
          "border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer",
      })}
    >
      <input {...getInputProps()} />
      {displayFileName ? (
        <p className="text-gray-700 dark:text-white">{displayFileName}</p>
      ) : (
        <p className="text-gray-500 dark:text-white">
          Drag & drop a file here, or click to select one
        </p>
      )}
    </div>
  );
};

export default GradingPage;
