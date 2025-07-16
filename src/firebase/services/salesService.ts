
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy, DocumentReference, where } from 'firebase/firestore';
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

const getSalesCollectionRef = async () => {
    const user = await getCurrentUser();
    return collection(db, 'users', user.uid, 'sales');
}

// Function to add a new sale and return its reference
export async function addSale(saleData: NewSale): Promise<DocumentReference> {
  const salesCollectionRef = await getSalesCollectionRef();
  
  const docRef = await addDoc(salesCollectionRef, {
    ...saleData,
    createdAt: serverTimestamp(),
  });
  return docRef;
}

// Function to get all sales for a user's branch
export async function getSales(branchId: string): Promise<Sale[]> {
  const salesCollectionRef = await getSalesCollectionRef();
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
