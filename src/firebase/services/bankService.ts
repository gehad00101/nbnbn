
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy } from 'firebase/firestore';

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

const getBankCollectionRef = () => {
    // We are using a hard-coded user ID because auth has been removed.
    const userId = 'default-user';
    return collection(db, 'users', userId, 'bankTransactions');
}

// Function to add a new bank transaction
export async function addBankTransaction(transactionData: NewBankTransaction) {
  const bankCollectionRef = getBankCollectionRef();
  
  await addDoc(bankCollectionRef, {
    ...transactionData,
    createdAt: serverTimestamp(),
  });
}

// Function to get all bank transactions for a user
export async function getBankTransactions(): Promise<BankTransaction[]> {
  const bankCollectionRef = getBankCollectionRef();
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
