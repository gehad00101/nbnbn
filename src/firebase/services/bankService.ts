
import { db, auth } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy, where } from 'firebase/firestore';
import { getCurrentUser } from '@/utils/auth';

export interface BankTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdrawal';
  createdAt: any;
  branchId?: string;
}

export interface NewBankTransaction {
  description: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdrawal';
  branchId?: string;
}

const getBankCollectionRef = async () => {
    const user = await getCurrentUser();
    return collection(db, 'users', user.uid, 'bankTransactions');
}

// Function to add a new bank transaction
export async function addBankTransaction(transactionData: NewBankTransaction) {
  const bankCollectionRef = await getBankCollectionRef();
  
  await addDoc(bankCollectionRef, {
    ...transactionData,
    createdAt: serverTimestamp(),
  });
}

// Function to get all bank transactions for a user
export async function getBankTransactions(): Promise<BankTransaction[]> {
  const bankCollectionRef = await getBankCollectionRef();
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
