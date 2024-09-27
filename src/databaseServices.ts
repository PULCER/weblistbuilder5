import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';

export async function createList(userId: string, title: string): Promise<{ id: string; rank: number }> {
  try {
    const listsSnapshot = await getDocs(query(collection(db, `users/${userId}/lists`), orderBy('rank', 'desc')));
    const highestRank = listsSnapshot.empty ? 0 : listsSnapshot.docs[0].data().rank;
    const newRank = highestRank + 1;

    const listRef = await addDoc(collection(db, `users/${userId}/lists`), {
      title,
      rank: newRank
    });
    console.log('List created with ID: ', listRef.id);
    return { id: listRef.id, rank: newRank };
  } catch (error) {
    console.error('Error creating list:', error);
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
    const listsSnapshot = await getDocs(query(collection(db, `users/${userId}/lists`), orderBy('rank')));
    return listsSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      rank: doc.data().rank
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

export async function updateListRank(userId: string, listId: string, newRank: number) {
  try {
    const listRef = doc(db, `users/${userId}/lists/${listId}`);
    await updateDoc(listRef, { rank: newRank });
    console.log('List rank updated successfully');
  } catch (error) {
    console.error('Error updating list rank:', error);
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

export async function addItemToList(userId: string, listId: string, title: string) {
  try {
    const itemsSnapshot = await getDocs(query(collection(db, `users/${userId}/lists/${listId}/items`), orderBy('rank', 'desc')));
    const highestRank = itemsSnapshot.empty ? 0 : itemsSnapshot.docs[0].data().rank;
    const newRank = highestRank + 1;

    const itemRef = await addDoc(collection(db, `users/${userId}/lists/${listId}/items`), {
      title,
      rank: newRank,
      createdAt: new Date()
    });
    console.log('Item added with ID: ', itemRef.id);
    return { id: itemRef.id, title, rank: newRank };
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
}

export async function getItems(userId: string, listId: string) {
  try {
    const itemsSnapshot = await getDocs(query(collection(db, `users/${userId}/lists/${listId}/items`), orderBy('rank')));
    return itemsSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      rank: doc.data().rank
    }));
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
}

export async function updateItemTitle(userId: string, listId: string, itemId: string, newTitle: string) {
  try {
    const itemRef = doc(db, `users/${userId}/lists/${listId}/items/${itemId}`);
    await updateDoc(itemRef, { title: newTitle });
    console.log('Item title updated successfully');
  } catch (error) {
    console.error('Error updating item title:', error);
    throw error;
  }
}

export async function updateItemRank(userId: string, listId: string, itemId: string, newRank: number) {
  try {
    const itemRef = doc(db, `users/${userId}/lists/${listId}/items/${itemId}`);
    await updateDoc(itemRef, { rank: newRank });
    console.log('Item rank updated successfully');
  } catch (error) {
    console.error('Error updating item rank:', error);
    throw error;
  }
}

export async function deleteItem(userId: string, listId: string, itemId: string) {
  try {
    await deleteDoc(doc(db, `users/${userId}/lists/${listId}/items/${itemId}`));
    console.log('Item deleted successfully');
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

export async function addSubItem(userId: string, listId: string, itemId: string, text: string) {
  try {
    const subItemsSnapshot = await getDocs(query(collection(db, `users/${userId}/lists/${listId}/items/${itemId}/subItems`), orderBy('rank', 'desc')));
    const highestRank = subItemsSnapshot.empty ? 0 : subItemsSnapshot.docs[0].data().rank;
    const newRank = highestRank + 1;

    const subItemRef = await addDoc(collection(db, `users/${userId}/lists/${listId}/items/${itemId}/subItems`), {
      text,
      rank: newRank,
      createdAt: new Date()
    });
    console.log('SubItem added with ID: ', subItemRef.id);
    return { id: subItemRef.id, rank: newRank };
  } catch (error) {
    console.error('Error adding subItem:', error);
    throw error;
  }
}

export async function getSubItems(userId: string, listId: string, itemId: string) {
  try {
    const subItemsSnapshot = await getDocs(query(collection(db, `users/${userId}/lists/${listId}/items/${itemId}/subItems`), orderBy('rank')));
    return subItemsSnapshot.docs.map(doc => ({
      id: doc.id,
      text: doc.data().text,
      rank: doc.data().rank
    }));
  } catch (error) {
    console.error('Error getting subItems:', error);
    throw error;
  }
}

export async function updateSubItemText(userId: string, listId: string, itemId: string, subItemId: string, newText: string) {
  try {
    const subItemRef = doc(db, `users/${userId}/lists/${listId}/items/${itemId}/subItems/${subItemId}`);
    await updateDoc(subItemRef, { text: newText });
    console.log('SubItem text updated successfully');
  } catch (error) {
    console.error('Error updating subItem text:', error);
    throw error;
  }
}

export async function updateSubItemRank(userId: string, listId: string, itemId: string, subItemId: string, newRank: number) {
  try {
    const subItemRef = doc(db, `users/${userId}/lists/${listId}/items/${itemId}/subItems/${subItemId}`);
    await updateDoc(subItemRef, { rank: newRank });
    console.log('SubItem rank updated successfully');
  } catch (error) {
    console.error('Error updating subItem rank:', error);
    throw error;
  }
}

export async function deleteSubItem(userId: string, listId: string, itemId: string, subItemId: string) {
  try {
    await deleteDoc(doc(db, `users/${userId}/lists/${listId}/items/${itemId}/subItems/${subItemId}`));
    console.log('SubItem deleted successfully');
  } catch (error) {
    console.error('Error deleting subItem:', error);
    throw error;
  }
}

export async function updateItemDescription(userId: string, listId: string, itemId: string, newDescription: string) {
  try {
    const itemRef = doc(db, `users/${userId}/lists/${listId}/items/${itemId}`);
    await updateDoc(itemRef, { description: newDescription });
    console.log('Item description updated successfully');
  } catch (error) {
    console.error('Error updating item description:', error);
    throw error;
  }
}