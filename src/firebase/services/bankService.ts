
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy } from 'firebase/firestore';
import { getCurrentUser } from '@/utils/auth';

export interface BankTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdrawal';
  createdAt: any;
}

export interface NewBankTransaction {
  description: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdrawal';
}

// Function to add a new bank transaction
export async function addBankTransaction(transactionData: NewBankTransaction) {
  const user = await getCurrentUser();
  const bankCollectionRef = collection(db, 'users', user.uid, 'bankTransactions');
  
  await addDoc(bankCollectionRef, {
    ...transactionData,
    createdAt: serverTimestamp(),
    userId: user.uid,
  });
}

// Function to get all bank transactions for a user
export async function getBankTransactions(): Promise<BankTransaction[]> {
  const user = await getCurrentUser();
  const bankCollectionRef = collection(db, 'users', user.uid, 'bankTransactions');
  const q = query(
    bankCollectionRef, 
    orderBy('date', 'desc'),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const transactions: BankTransaction[] = [];
  querySnapshot.forEach((doc) => {
    transactions.push({ id: doc.id, ...doc.data() } as BankTransaction);
  });

  return transactions;
}
