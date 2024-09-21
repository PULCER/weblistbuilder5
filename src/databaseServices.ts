import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query } from 'firebase/firestore';

export async function createList(userId: string, title: string) {
  try {
    const listRef = await addDoc(collection(db, `users/${userId}/lists`), {
      title
    });
    console.log('List created with ID: ', listRef.id);
    return listRef.id;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
}

export async function addItemToList(userId: string, listId: string, title: string, notes: string) {
  try {
    const itemRef = await addDoc(collection(db, `users/${userId}/lists/${listId}/items`), {
      title,
      notes,
      createdAt: new Date()
    });
    console.log('Item added with ID: ', itemRef.id);
    return itemRef.id;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
}

export async function addSubItemToItem(userId: string, listId: string, itemId: string, subitemtitle: string, subitemnotes: string) {
  try {
    const subItemRef = await addDoc(collection(db, `users/${userId}/lists/${listId}/items/${itemId}/subItems`), {
      subitemtitle,
      subitemnotes,
      createdAt: new Date()
    });
    console.log('SubItem added with ID: ', subItemRef.id);
    return subItemRef.id;
  } catch (error) {
    console.error('Error adding subItem:', error);
    throw error;
  }
}

export async function getLists(userId: string) {
  try {
    const listsSnapshot = await getDocs(collection(db, `users/${userId}/lists`));
    return listsSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title
    }));
  } catch (error) {
    console.error('Error getting lists:', error);
    throw error;
  }
}

export async function updateListTitle(userId: string, listId: string, newTitle: string) {
  try {
    const listRef = doc(db, `users/${userId}/lists/${listId}`);
    await updateDoc(listRef, { title: newTitle });
    console.log('List title updated successfully');
  } catch (error) {
    console.error('Error updating list title:', error);
    throw error;
  }
}

export async function deleteList(userId: string, listId: string) {
  try {
    await deleteDoc(doc(db, `users/${userId}/lists/${listId}`));
    console.log('List deleted successfully');
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
}