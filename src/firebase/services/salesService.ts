
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, orderBy, DocumentReference } from 'firebase/firestore';
import { getCurrentUser } from '@/utils/auth';

export interface Sale {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'paid' | 'due';
  branchId: string;
}

export interface NewSale {
  customerName: string;
  amount: number;
  date: string;
  status: 'paid' | 'due';
  branchId: string;
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

// Function to get all sales for a specific branch
export async function getSalesForBranch(branchId: string): Promise<Sale[]> {
  const user = await getCurrentUser();
  const salesCollectionRef = collection(db, 'users', user.uid, 'sales');
  const q = query(
    salesCollectionRef, 
    where('branchId', '==', branchId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const sales: Sale[] = [];
  querySnapshot.forEach((doc) => {
    sales.push({ id: doc.id, ...doc.data() } as Sale);
  });

  return sales;
}
