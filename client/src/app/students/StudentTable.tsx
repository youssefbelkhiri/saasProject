const StudentTable = ({ students, onDeleteStudent, onEditStudent }) => {
  // const groups = students.groups.map((group) => group.group_id);

  const getGroupIds = (student) => {
    return student.groups.map((group) => group.name).join(", ");
  };

  console.log(students.type);
  console.log(students);
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
          <tr key={student.id}>
            <td className="border px-4 py-2">{student.student_number}</td>
            <td className="border px-4 py-2">{student.first_name}</td>
            <td className="border px-4 py-2">{student.last_name}</td>
            <td className="border px-4 py-2">{getGroupIds(student)}</td>
            <td className="border px-4 py-2">
              <button
                onClick={() => onDeleteStudent(student.student_id)}
                className="mr-2 text-red-500"
              >
                Delete
              </button>
              <button
                onClick={() => onEditStudent(student)}
                className="text-blue-500"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;
