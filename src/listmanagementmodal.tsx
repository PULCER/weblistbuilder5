import React, { useState, useEffect, useRef } from 'react';
import { createList, updateListTitle, deleteList } from './databaseServices';

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
  currentListIndex: number;
}

const ListManagementModal: React.FC<ListManagementModalProps> = ({
  isOpen,
  onClose,
  userId,
  lists,
  setLists,
  currentListIndex,
}) => {
  const [editedLists, setEditedLists] = useState<List[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setEditedLists(lists);
  }, [lists]);

  useEffect(() => {
    if (isOpen && inputRefs.current[currentListIndex]) {
      inputRefs.current[currentListIndex]?.focus();
    }
  }, [isOpen, currentListIndex]);

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

  const handleDeleteList = (index: number) => {
    const updatedLists = editedLists.filter((_, i) => i !== index);
    setEditedLists(updatedLists);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    for (const list of editedLists) {
      await updateListTitle(userId, list.id, list.title);
    }
    // Delete lists that are not in editedLists
    for (const list of lists) {
      if (!editedLists.some(editedList => editedList.id === list.id)) {
        await deleteList(userId, list.id);
      }
    }
    setLists(editedLists);
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Manage Lists</h2>
        <div className="lists-scroll-view">
          {editedLists.map((list, index) => (
            <div key={list.id} className="list-item">
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={list.title}
                onChange={(e) => handleListTitleChange(index, e.target.value)}
              />
              <button 
                onClick={() => handleDeleteList(index)} 
                className="delete-list-button"
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  marginLeft: '10px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
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