import { useState } from 'react';

const ManageGroupsModal = ({ isOpen, onClose }) => {
  const [groups, setGroups] = useState([
    { id: 1, name: 'Group 1' },
    { id: 2, name: 'Group 2' },
    { id: 3, name: 'Group 3' },
  ]);
  const [newGroupName, setNewGroupName] = useState('');
  const [editedGroupName, setEditedGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const addGroup = () => {
    if (newGroupName.trim() === '') {
      alert('Please enter a group name.');
      return;
    }
    const newGroup = {
      id: groups.length + 1,
      name: newGroupName,
    };
    setGroups([...groups, newGroup]);
    setNewGroupName('');
  };

  const editGroup = () => {
    if (editedGroupName.trim() === '') {
      alert('Please enter a group name.');
      return;
    }
    const updatedGroups = groups.map((group) => {
      if (group.id === selectedGroupId) {
        return { ...group, name: editedGroupName };
      }
      return group;
    });
    setGroups(updatedGroups);
    setEditedGroupName('');
    setSelectedGroupId(null);
  };

  const deleteGroup = (groupId) => {
    const updatedGroups = groups.filter((group) => group.id !== groupId);
    setGroups(updatedGroups);
  };

  return (
    isOpen && (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl dark:bg-dark">
            <button className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-lg font-semibold mb-4">Manage Groups</h2>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="group_name">
                New Group Name
              </label>
              <input
                type="text"
                id="group_name"
                name="group_name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              />
            </div>

            <button
              onClick={addGroup}
              className="w-full p-2 border rounded bg-primary text-white mb-4"
            >
              Add Group
            </button>

            <h3 className="text-md font-semibold mb-2">Groups</h3>
            <ul className="mb-4">
              {groups.map((group) => (
                <li key={group.id} className="flex justify-between items-center border-b py-2">
                  <span>{group.name}</span>
                  <div>
                    <button className="text-blue-500 mr-2" onClick={() => setSelectedGroupId(group.id)}>Edit</button>
                    <button className="text-red-500" onClick={() => deleteGroup(group.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Edit Group Modal */}
            {selectedGroupId && (
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="edited_group_name">
                  Edit Group Name
                </label>
                <input
                  type="text"
                  id="edited_group_name"
                  name="edited_group_name"
                  value={editedGroupName}
                  onChange={(e) => setEditedGroupName(e.target.value)}
                  className="w-full p-2 border-stroke dark:text-body-color-dark dark:shadow-two rounded-sm border bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                />
                <button
                  onClick={editGroup}
                  className="w-full p-2 border rounded bg-primary text-white mt-2"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ManageGroupsModal;
