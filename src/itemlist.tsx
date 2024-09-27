// src/ItemList.tsx
import React, { useState, useEffect } from 'react';
import { getItems, addItemToList } from './databaseServices';
import { Plus } from 'lucide-react';
import ItemModal from './itemmodal';

interface Item {
  id: string;
  title: string;
  description?: string;
  rank: number;
}

interface ItemListProps {
  userId: string;
  listId: string;
}

const ItemList: React.FC<ItemListProps> = ({ userId, listId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [userId, listId]);

  const fetchItems = async () => {
    try {
      const fetchedItems = await getItems(userId, listId);
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (newItemTitle.trim()) {
      try {
        const newItem = await addItemToList(userId, listId, newItemTitle.trim());
        setItems([...items, newItem]);
        setNewItemTitle('');
      } catch (error) {
        console.error('Error adding new item:', error);
      }
    }
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading items...</div>;
  }

  return (
    <div className="item-list">
      {items.length === 0 ? (
        <p>No items in this list yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="item" onClick={() => handleItemClick(item)}>
              <span className="item-title">{item.title}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="add-item-form">
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder="Enter new item title"
          className="add-item-input"
        />
        <button onClick={handleAddItem} className="add-item-button">
          <Plus size={20} />
          Add Item
        </button>
      </div>
      {selectedItem && (
        <ItemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userId={userId}
          listId={listId}
          item={selectedItem}
          onItemUpdate={fetchItems}
        />
      )}
    </div>
  );
};

export default ItemList;