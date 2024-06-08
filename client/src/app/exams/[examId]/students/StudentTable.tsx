const StudentTable = ({ students, onDeleteStudent }) => {
    return (
      <table className="w-full mt-4">
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
            <tr key={student.id}>
              <td className="border px-4 py-2">{student.studentNumber}</td>
              <td className="border px-4 py-2">{student.firstName}</td>
              <td className="border px-4 py-2">{student.lastName}</td>
              <td className="border px-4 py-2">
                {student.groups.length > 0 ? student.groups.join(', ') : 'No Groups'}
              </td>
              <td className="border px-4 py-2">
                <button onClick={() => onDeleteStudent(student.id)} className="text-red-500 mr-2">Delete From Exam</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  export default StudentTable;
