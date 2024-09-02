import React, { useState, useEffect } from 'react';
import { createList, getLists, addItemToList } from './databaseServices';

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [lists, setLists] = useState<any[]>([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  useEffect(() => {
    fetchLists();
  }, [userId]);

  const fetchLists = async () => {
    try {
      const fetchedLists = await getLists(userId);
      setLists(fetchedLists);
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
    if (selectedListId) {
      try {
        await addItemToList(userId, selectedListId, newItemTitle, newItemNotes);
        setNewItemTitle('');
        setNewItemNotes('');
        fetchLists();
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  return (
    <div className="dashboard">
      <h2>Your Lists</h2>
      <div>
        <input
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="New List Title"
        />
        <button onClick={handleCreateList}>Create List</button>
      </div>
      <ul>
        {lists.map((list) => (
          <li key={list.id} onClick={() => setSelectedListId(list.id)}>
            {list.title}
          </li>
        ))}
      </ul>
      {selectedListId && (
        <div>
          <h3>Add Item to Selected List</h3>
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Item Title"
          />
          <input
            type="text"
            value={newItemNotes}
            onChange={(e) => setNewItemNotes(e.target.value)}
            placeholder="Item Notes"
          />
          <button onClick={handleAddItem}>Add Item</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
