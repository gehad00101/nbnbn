
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { getCurrentUser } from '@/utils/auth';

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

const getInventoryCollectionRef = async () => {
    const user = await getCurrentUser();
    return collection(db, 'users', user.uid, 'inventory');
}

// Function to add a new inventory item
export async function addInventoryItem(itemData: NewInventoryItem) {
  const inventoryCollectionRef = await getInventoryCollectionRef();
  
  await addDoc(inventoryCollectionRef, {
    ...itemData,
    createdAt: serverTimestamp(),
  });
}

// Function to get all inventory items for a user's branch
export async function getInventoryItems(branchId: string): Promise<InventoryItem[]> {
  const inventoryCollectionRef = await getInventoryCollectionRef();
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
  const user = await getCurrentUser();
  const itemDocRef = doc(db, 'users', user.uid, 'inventory', itemId);
  await updateDoc(itemDocRef, itemData);
}

// Function to delete an inventory item
export async function deleteInventoryItem(itemId: string) {
  const user = await getCurrentUser();
  const itemDocRef = doc(db, 'users', user.uid, 'inventory', itemId);
  await deleteDoc(itemDocRef);
}
