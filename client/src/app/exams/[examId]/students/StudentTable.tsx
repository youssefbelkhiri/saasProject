const StudentTable = ({ students, onDeleteStudent }) => {
  const getGroupIds = (student) => {
    return student.groups.map((group) => group.name).join(", ");
  };
  return (
    <table className="mt-4 w-full">
      <thead>
        <tr>
          <th className="border px-4 py-2">Student Number</th>
          <th className="border px-4 py-2">First Name</th>
          <th className="border px-4 py-2">Last Name</th>
          <th className="border px-4 py-2">Groups</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.student_id}>
            <td className="border px-4 py-2">{student.student_number}</td>
            <td className="border px-4 py-2">{student.first_name}</td>
            <td className="border px-4 py-2">{student.last_name}</td>
            <td className="border px-4 py-2">{getGroupIds(student)}</td>
            <td className="border px-4 py-2">
              <button
                onClick={() => onDeleteStudent(student.student_id)}
                className="mr-2 text-red-500"
              >
                Delete From Exam
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;
