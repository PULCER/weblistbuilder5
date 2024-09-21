// src/ItemList.tsx
import React, { useState, useEffect } from 'react';
import { getItems } from './databaseServices';

interface Item {
  id: string;
  title: string;
  rank: number;
}

interface ItemListProps {
  userId: string;
  listId: string;
}

const ItemList: React.FC<ItemListProps> = ({ userId, listId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchItems();
  }, [userId, listId]);

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
            <li key={item.id} className="item">
              <span className="item-title">{item.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList;