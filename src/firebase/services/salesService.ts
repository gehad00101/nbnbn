
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy, DocumentReference } from 'firebase/firestore';

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

const getSalesCollectionRef = () => {
    // We are using a hard-coded user ID because auth has been removed.
    const userId = 'default-user';
    return collection(db, 'users', userId, 'sales');
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

// Function to get all sales for a user
export async function getSales(): Promise<Sale[]> {
  const salesCollectionRef = getSalesCollectionRef();
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
