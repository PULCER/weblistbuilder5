import React, { useState, useEffect } from 'react';
import { createList, getLists, addItemToList, getItems } from './databaseServices';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  return (
    <div className="dashboard">
      <div className="list-carousel">
        <button onClick={handlePrevList} className="carousel-button">
          <ChevronLeft size={24} />
        </button>
        {lists.length > 0 ? (
          <div className="list-name">
            <h2>{lists[currentListIndex].title}</h2>
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
      {lists.length > 0 && (
        <ul className="items-list">
          {lists[currentListIndex].items.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}
      <div className="add-item-form">
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder="New Item Title"
        />
        <button onClick={handleAddItem} className="add-item-button">Add Item</button>
      </div>
      <div className="add-list-form">
        <input
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="New List Title"
        />
        <button onClick={handleCreateList}>Create List</button>
      </div>
    </div>
  );
};

export default Dashboard;