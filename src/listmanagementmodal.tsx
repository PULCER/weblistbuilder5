import React, { useState, useEffect } from 'react';
import { createList, updateListTitle } from './databaseServices';

interface List {
  id: string;
  title: string;
}

interface ListManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
}

const ListManagementModal: React.FC<ListManagementModalProps> = ({
  isOpen,
  onClose,
  userId,
  lists,
  setLists,
}) => {
  const [editedLists, setEditedLists] = useState<List[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedLists(lists);
  }, [lists]);

  const handleAddList = async () => {
    const newListId = await createList(userId, "New List");
    setEditedLists([...editedLists, { id: newListId, title: "New List" }]);
    setHasChanges(true);
  };

  const handleListTitleChange = (index: number, newTitle: string) => {
    const updatedLists = [...editedLists];
    updatedLists[index].title = newTitle;
    setEditedLists(updatedLists);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    for (const list of editedLists) {
      await updateListTitle(userId, list.id, list.title);
    }
    setLists(editedLists);
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Manage Lists</h2>
        <div className="lists-scroll-view">
          {editedLists.map((list, index) => (
            <input
              key={list.id}
              type="text"
              value={list.title}
              onChange={(e) => handleListTitleChange(index, e.target.value)}
            />
          ))}
        </div>
        <button onClick={handleAddList}>Add New List</button>
        {hasChanges && <button onClick={handleSaveChanges}>Save Changes</button>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ListManagementModal;