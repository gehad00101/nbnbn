
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  unitPrice: number | null;
  createdAt: any;
  branchId: string;
}

export interface NewInventoryItem {
  name: string;
  quantity: number;
  unitCost: number;
  unitPrice: number | null;
  branchId: string;
}

const FAKE_USER_ID = 'default-user';

const getInventoryCollectionRef = () => {
    return collection(db, 'users', FAKE_USER_ID, 'inventory');
}

// Function to add a new inventory item
export async function addInventoryItem(itemData: NewInventoryItem) {
  const inventoryCollectionRef = getInventoryCollectionRef();
  
  await addDoc(inventoryCollectionRef, {
    ...itemData,
    createdAt: serverTimestamp(),
  });
}

// Function to get all inventory items for a user's branch
export async function getInventoryItems(branchId: string): Promise<InventoryItem[]> {
  const inventoryCollectionRef = getInventoryCollectionRef();
  const q = query(
    inventoryCollectionRef, 
    where('branchId', '==', branchId),
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
  const itemDocRef = doc(db, 'users', FAKE_USER_ID, 'inventory', itemId);
  await updateDoc(itemDocRef, itemData);
}

// Function to delete an inventory item
export async function deleteInventoryItem(itemId: string) {
  const itemDocRef = doc(db, 'users', FAKE_USER_ID, 'inventory', itemId);
  await deleteDoc(itemDocRef);
}
