
import { db, auth } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy, DocumentReference, where } from 'firebase/firestore';

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

const getSalesCollectionRef = () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    return collection(db, 'users', user.uid, 'sales');
}

// Function to add a new sale and return its reference
export async function addSale(saleData: NewSale): Promise<DocumentReference> {
  const salesCollectionRef = getSalesCollectionRef();
  
  const docRef = await addDoc(salesCollectionRef, {
    ...saleData,
    createdAt: serverTimestamp(),
  });
  return docRef;
}

// Function to get all sales for a user's branch
export async function getSales(branchId: string): Promise<Sale[]> {
  const salesCollectionRef = getSalesCollectionRef();
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
