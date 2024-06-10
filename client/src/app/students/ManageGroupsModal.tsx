import axios from "axios";
import { useState } from "react";

const ManageGroupsModal = ({ isOpen, onClose, groups }) => {
  const [groupsUser, setGroupsUser] = useState(groups);
  const [newGroupName, setNewGroupName] = useState("");
  const [editedGroupName, setEditedGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  console.log(groups);
  console.log(groupsUser);

  const addGroup = async () => {
    if (newGroupName.trim() === "") {
      alert("Please enter a group name.");
      return;
    }
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:3000/api/groups",
        { name: newGroupName },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      console.log("Group added successfully:", response.data);
      const newGroup = response.data.id;
      setGroupsUser([...groups, newGroup]);

      setNewGroupName("");
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  const editGroup = async () => {
    if (editedGroupName.trim() === "") {
      alert("Please enter a group name.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.patch(
        `http://localhost:3000/api/groups/${selectedGroupId}`,
        { name: editedGroupName },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      const updatedGroups = groups.map((group) => {
        if (group.id === selectedGroupId) {
          return { ...group, name: editedGroupName };
        }
        return group;
      });
      setGroupsUser(updatedGroups);
      setEditedGroupName("");
      setSelectedGroupId(null);
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:3000/api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const updatedGroups = groupsUser.filter(
        (group) => group.group_id !== groupId,
      );
      setGroupsUser(updatedGroups);
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-dark">
            <button
              className="absolute right-0 top-0 mr-4 mt-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="mb-4 text-lg font-semibold">Manage Groups</h2>

            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold"
                htmlFor="group_name"
              >
                New Group Name
              </label>
              <input
                type="text"
                id="group_name"
                name="group_name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
              />
            </div>

            <button
              onClick={addGroup}
              className="mb-4 w-full rounded border bg-primary p-2 text-white"
            >
              Add Group
            </button>

            <h3 className="text-md mb-2 font-semibold">Groups</h3>
            <ul className="mb-4">
              {groupsUser.map((group) => (
                <li
                  key={group.group_id}
                  className="flex items-center justify-between border-b py-2"
                >
                  <span>{group.name}</span>
                  <div>
                    <button
                      className="mr-2 text-blue-500"
                      onClick={() => setSelectedGroupId(group.group_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => deleteGroup(group.group_id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Edit Group Modal */}
            {selectedGroupId && (
              <div className="mb-4">
                <label
                  className="mb-2 block text-sm font-bold"
                  htmlFor="edited_group_name"
                >
                  Edit Group Name
                </label>
                <input
                  type="text"
                  id="edited_group_name"
                  name="edited_group_name"
                  value={editedGroupName}
                  onChange={(e) => setEditedGroupName(e.target.value)}
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] p-2 px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                />
                <button
                  onClick={editGroup}
                  className="mt-2 w-full rounded border bg-primary p-2 text-white"
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
