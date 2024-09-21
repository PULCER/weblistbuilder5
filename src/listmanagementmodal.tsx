import React, { useState, useEffect } from 'react';
import { createList, updateListTitle, deleteList, updateListRank } from './databaseServices';
import { ChevronUp, ChevronDown } from 'lucide-react'; // Make sure to import these icons

interface List {
  id: string;
  title: string;
  rank: number;
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

  useEffect(() => {
    setEditedLists(lists);
  }, [lists]);

  const handleAddList = async () => {
    const { id: newListId, rank: newRank } = await createList(userId, "New List");
    setEditedLists([...editedLists, { id: newListId, title: "New List", rank: newRank }]);
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
      await updateListRank(userId, list.id, list.rank);
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

  const moveList = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === editedLists.length - 1)) {
      return; // Can't move further in this direction
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedLists = [...editedLists];
    [updatedLists[index], updatedLists[newIndex]] = [updatedLists[newIndex], updatedLists[index]];
    
    // Update ranks
    updatedLists.forEach((list, i) => {
      list.rank = i + 1;
    });

    setEditedLists(updatedLists);
    setHasChanges(true);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Manage Lists</h2>
        <div className="lists-scroll-view">
          {editedLists.map((list, index) => (
            <div key={list.id} className="list-item">
              <div className="list-controls">
                <button onClick={() => moveList(index, 'up')} disabled={index === 0}>
                  <ChevronUp size={16} />
                </button>
                <button onClick={() => moveList(index, 'down')} disabled={index === editedLists.length - 1}>
                  <ChevronDown size={16} />
                </button>
              </div>
              <input
                type="text"
                value={list.title}
                onChange={(e) => handleListTitleChange(index, e.target.value)}
              />
              <button 
                onClick={() => handleDeleteList(index)} 
                className="delete-list-button"
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