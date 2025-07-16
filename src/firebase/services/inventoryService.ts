
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  unitPrice: number | null;
  createdAt: any;
}

export interface NewInventoryItem {
  name: string;
  quantity: number;
  unitCost: number;
  unitPrice: number | null;
}

const getInventoryCollectionRef = () => {
    // We are using a hard-coded user ID because auth has been removed.
    const userId = 'default-user';
    return collection(db, 'users', userId, 'inventory');
}

// Function to add a new inventory item
export async function addInventoryItem(itemData: NewInventoryItem) {
  const inventoryCollectionRef = getInventoryCollectionRef();
  
  await addDoc(inventoryCollectionRef, {
    ...itemData,
    createdAt: serverTimestamp(),
  });
}

// Function to get all inventory items for a user
export async function getInventoryItems(): Promise<InventoryItem[]> {
  const inventoryCollectionRef = getInventoryCollectionRef();
  const q = query(
    inventoryCollectionRef, 
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const items: InventoryItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as InventoryItem);
  });

  return items;
}

// Function to update an inventory item
export async function updateInventoryItem(itemId: string, itemData: Partial<NewInventoryItem>) {
  // We are using a hard-coded user ID because auth has been removed.
  const userId = 'default-user';
  const itemDocRef = doc(db, 'users', userId, 'inventory', itemId);
  await updateDoc(itemDocRef, itemData);
}

// Function to delete an inventory item
export async function deleteInventoryItem(itemId: string) {
  // We are using a hard-coded user ID because auth has been removed.
  const userId = 'default-user';
  const itemDocRef = doc(db, 'users', userId, 'inventory', itemId);
  await deleteDoc(itemDocRef);
}
