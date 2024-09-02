import React, { useState, useEffect } from 'react';
import { createList, getLists, addItemToList, getItems, updateListTitle } from './databaseServices';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

interface DashboardProps {
  userId: string;
}

interface ListItem {
  id: string;
  title: string;
  notes: string;
}

interface List {
  id: string;
  title: string;
  items: ListItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [lists, setLists] = useState<List[]>([]);
  const [currentListIndex, setCurrentListIndex] = useState(0);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    fetchLists();
  }, [userId]);

  const fetchLists = async () => {
    try {
      const fetchedLists = await getLists(userId);
      const listsWithItems = await Promise.all(
        fetchedLists.map(async (list) => {
          const items = await getItems(userId, list.id);
          return { ...list, items } as List;
        })
      );
      setLists(listsWithItems);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const handleCreateList = async () => {
    try {
      await createList(userId, newListTitle);
      setNewListTitle('');
      fetchLists();
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleAddItem = async () => {
    if (lists.length > 0) {
      try {
        await addItemToList(userId, lists[currentListIndex].id, newItemTitle, '');
        setNewItemTitle('');
        fetchLists();
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const handlePrevList = () => {
    setCurrentListIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : lists.length - 1
    );
  };

  const handleNextList = () => {
    setCurrentListIndex((prevIndex) => 
      prevIndex < lists.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleEditTitle = () => {
    setEditedTitle(lists[currentListIndex].title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = async () => {
    try {
      await updateListTitle(userId, lists[currentListIndex].id, editedTitle);
      const updatedLists = [...lists];
      updatedLists[currentListIndex].title = editedTitle;
      setLists(updatedLists);
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error updating list title:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
  };

  return (
    <div className="dashboard">
      <div className="list-carousel">
        <button onClick={handlePrevList} className="carousel-button">
          <ChevronLeft size={24} />
        </button>
        {lists.length > 0 ? (
          <div className="list-name">
            {isEditingTitle ? (
              <div className="edit-title-container">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="edit-title-input"
                />
                <div className="edit-controls">
                  <button onClick={handleSaveTitle} className="edit-control-button save">
                    <Check size={20} />
                  </button>
                  <button onClick={handleCancelEdit} className="edit-control-button cancel">
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <h2 onClick={handleEditTitle}>{lists[currentListIndex].title}</h2>
            )}
          </div>
        ) : (
          <div className="list-name">
            <h2>No Lists</h2>
          </div>
        )}
        <button onClick={handleNextList} className="carousel-button">
          <ChevronRight size={24} />
        </button>
      </div>
      {/* Rest of the component remains the same */}
    </div>
  );
};

export default Dashboard;