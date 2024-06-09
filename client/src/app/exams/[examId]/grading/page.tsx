"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

const fetchExamData = async (examId: any) => {
  // Your fetch logic here
};

const GradingPage = () => {
  const [students, setStudents] = useState([
    { id: 1, studentNumber: '1001', firstName: 'John', lastName: 'Doe' },
    { id: 2, studentNumber: '1002', firstName: 'Jane', lastName: 'Smith' },
    { id: 3, studentNumber: '1003', firstName: 'Michael', lastName: 'Johnson' },
    { id: 4, studentNumber: '1004', firstName: 'Emily', lastName: 'Brown' },
    { id: 5, studentNumber: '1005', firstName: 'David', lastName: 'Wilson' },
  ]);

  const handleImportPaper = (studentId: string, file: File) => {
    // Your file import logic here
  };

  const handleGradePaper = (studentId: string) => {
    // Your grading logic here
  };

  const handleFileUpload = (studentId: number, file: File) => {
    // Your file upload logic here
  };

  const { examId } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    if (examId) {
      fetchExamData(examId).then(data => setExam(data));
    }
  }, [examId]);

  const currentPath = typeof window !== "undefined" ? window.location.hash : '';

  return (
    <>
      <section className="relative z-10 py-16 md:py-20 lg:py-28">
        <div className="mx-auto max-w-[90%] rounded-lg bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px] md:max-w-[70%] lg:max-w-[90%]">
          <div className="container mx-auto text-center mb-12">
            <nav className="flex justify-center space-x-4">
              <Link href={`/exams/${examId}/overview`} passHref>
                <span className={`text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer`}>Overview</span>
              </Link>
              <Link href={`/exams/${examId}/questions`} passHref>
                <span className={`text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer`}>Questions</span>
              </Link>
              <Link href={`/exams/${examId}/students`} passHref>
                <span className={`text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer`}>Students</span>
              </Link>
              <Link href={`/exams/${examId}/grading`} passHref>
                <span className={`text-lg font-semibold text-primary hover:text-primary cursor-pointer`}>Grading</span>
              </Link>
              <Link href={`/exams/${examId}/reports`} passHref>
                <span className={`text-lg font-semibold text-black dark:text-white hover:text-primary cursor-pointer`}>Reports</span>
              </Link>
            </nav>
          </div>
          <div className="container mx-auto p-4">
            {exam && (
              <>
                <h1 className="text-3xl font-bold mb-4">{exam.name}</h1>
                <p><strong>Language:</strong> {exam.language}</p>
                <p><strong>Description:</strong> {exam.description}</p>
              </>
            )}

            <input
              type="text"
              placeholder="Search students..."
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-primary dark:bg-gray-800 dark:text-white w-full mt-4"
            />

            <table className="w-full mt-4">
              <thead className='text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-100'>
                <tr>
                  <th className="border px-4 py-2">Student Number</th>
                  <th className="border px-4 py-2">First Name</th>
                  <th className="border px-4 py-2">Last Name</th>
                  <th className="border px-4 py-2">Import Paper</th>
                  <th className="border px-4 py-2">Grad Paper</th>
                  <th className="border px-4 py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td className="border px-4 py-2">{student.studentNumber}</td>
                    <td className="border px-4 py-2">{student.firstName}</td>
                    <td className="border px-4 py-2">{student.lastName}</td>
                    <td className="border px-4 py-2">
                      <DropzoneComponent
                        studentId={student.id}
                        handleFileUpload={handleFileUpload}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleGradePaper(student.id)}
                        className="mr-2 bg-white border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300 focus:outline-none dark:bg-gray-800 dark:text-primary">
                        Grad Paper
                      </button>
                    </td>
                    <td className="border px-4 py-2">0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

const DropzoneComponent = ({ studentId, handleFileUpload }) => {
  const [fileName, setFileName] = useState('');

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    handleFileUpload(studentId, file);
    setFileName(file.name);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.pdf,.png,.jpg,.jpeg',
  });

  return (
    <div {...getRootProps({ className: 'border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer' })}>
      <input {...getInputProps()} />
      {fileName ? (
        <p className="text-gray-700  dark:text-white">{fileName}</p>
      ) : (
        <p className="text-gray-500 dark:text-white">Drag & drop a file here, or click to select one</p>
      )}
    </div>
  );
};

export default GradingPage;