
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy, DocumentReference } from 'firebase/firestore';
import { getCurrentUser } from '@/utils/auth';

export interface Sale {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'paid' | 'due';
}

export interface NewSale {
  customerName: string;
  amount: number;
  date: string;
  status: 'paid' | 'due';
}

// Function to add a new sale and return its reference
export async function addSale(saleData: NewSale): Promise<DocumentReference> {
  const user = await getCurrentUser();
  const salesCollectionRef = collection(db, 'users', user.uid, 'sales');
  
  const docRef = await addDoc(salesCollectionRef, {
    ...saleData,
    createdAt: serverTimestamp(),
    userId: user.uid,
  });
  return docRef;
}

// Function to get all sales for a user
export async function getSales(): Promise<Sale[]> {
  const user = await getCurrentUser();
  const salesCollectionRef = collection(db, 'users', user.uid, 'sales');
  const q = query(
    salesCollectionRef, 
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const sales: Sale[] = [];
  querySnapshot.forEach((doc) => {
    sales.push({ id: doc.id, ...doc.data() } as Sale);
  });

  return sales;
}
