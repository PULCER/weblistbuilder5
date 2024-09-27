// src/ItemModal.tsx
import React, { useState, useEffect } from 'react';
import { updateItemTitle, updateItemDescription, deleteItem } from './databaseServices';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  listId: string;
  item: {
    id: string;
    title: string;
    description?: string;
  };
  onItemUpdate: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, userId, listId, item, onItemUpdate }) => {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setTitle(item.title);
    setDescription(item.description || '');
  }, [item]);

  const handleSave = async () => {
    try {
      await updateItemTitle(userId, listId, item.id, title);
      await updateItemDescription(userId, listId, item.id, description);
      onItemUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) {
      try {
        await deleteItem(userId, listId, item.id);
        onItemUpdate();
        onClose();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    } else {
      setIsDeleting(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Item Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Item Description"
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Save Changes</button>
          <button onClick={handleDelete} className="delete-button">
            {isDeleting ? 'Confirm Delete' : 'Delete Item'}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;