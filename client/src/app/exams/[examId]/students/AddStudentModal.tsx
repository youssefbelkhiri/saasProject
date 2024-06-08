// AddStudentModal.tsx

import { useState } from 'react';
import Select from 'react-select';
import StudentTableModal from './StudentTableModal';

const AddStudentModal = ({ isOpen, onClose }) => {
  const [newStudent, setNewStudent] = useState({
    studentNumber: '',
    firstName: '',
    lastName: '',
    groups: [],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Sample list of groups
  const groups = ["Group A", "Group B", "Group C", "Group D"];

  const options = [
    { value: 'All', label: 'All' },
    ...groups.map((group) => ({ value: group, label: group })),
  ];

  const deleteStudent = (studentId) => {
    // Implement delete functionality here
  };

  // Sample list of students
  const sampleStudents = [
    { id: 1, studentNumber: "1001", firstName: "John", lastName: "Doe", groups: ["Group A", "Group B"] },
    { id: 2, studentNumber: "1002", firstName: "Jane", lastName: "Smith", groups: ["Group B"] },
    { id: 3, studentNumber: "1003", firstName: "Michael", lastName: "Johnson", groups: [] },
    { id: 4, studentNumber: "1004", firstName: "Emily", lastName: "Brown", groups: ["Group C", "Group D"] },
    { id: 5, studentNumber: "1005", firstName: "David", lastName: "Wilson", groups: ["Group A"] },
  ];

  const filteredStudents = sampleStudents.filter((student) => {
    const includesQuery = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const includesGroup = selectedGroup && selectedGroup.value !== 'All' ? student.groups.includes(selectedGroup.value) : true;
    return includesQuery && includesGroup;
  });

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedStudents(filteredStudents.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const toggleStudentSelection = (studentId) => {
    const selectedIndex = selectedStudents.indexOf(studentId);
    let newSelected = [...selectedStudents];

    if (selectedIndex === -1) {
      newSelected.push(studentId);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setSelectedStudents(newSelected);
  };

  const addStudent = async () => {
    console.log('New Student Data:', newStudent);
  };

  return (
    isOpen && (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white p-6 rounded-lg shadow-xl dark:bg-dark overflow-y-auto overflow-x-hidden fixed justify-center items-center w-4/5 max-w-7xl mx-auto z-20">
            <button className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold mb-4">Add Students to Exam</h2>

            <div className='mt-10'>
              <div className="w-full mb-6">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-primary dark:bg-gray-800 dark:text-white w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full mb-6">
                <Select
                  options={options}
                  defaultValue={options[0]}
                  onChange={(selectedOption) => setSelectedGroup(selectedOption)}
                  className='text-primary'
                />
              </div>
              <table className="w-full mt-4">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-blue-500"
                      />
                    </th>
                    <th className="border px-4 py-2">Student Number</th>
                    <th className="border px-4 py-2">First Name</th>
                    <th className="border px-4 py-2">Last Name</th>
                    <th className="border px-4 py-2">Groups</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className={selectedStudents.includes(student.id) ? 'bg-gray-200 dark:bg-gray-500' : ''}>
                      <td className="border px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="h-4 w-4 text-blue-500"
                        />
                      </td>
                      <td className="border px-4 py-2">{student.studentNumber}</td>
                      <td className="border px-4 py-2">{student.firstName}</td>
                      <td className="border px-4 py-2">{student.lastName}</td>
                      <td className="border px-4 py-2">
                        {student.groups.length > 0 ? student.groups.join(', ') : 'No Groups'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded mr-4" onClick={onClose}>Cancel</button>
              <button className="bg-primary text-white px-4 py-2 rounded" onClick={addStudent}>Add Students</button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AddStudentModal;
