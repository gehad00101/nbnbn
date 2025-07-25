
import { db, auth } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy, where } from 'firebase/firestore';

export interface BankTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdrawal';
  createdAt: any;
  branchId: string;
}

export interface NewBankTransaction {
  description: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdrawal';
  branchId: string;
}

const getBankCollectionRef = () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    return collection(db, 'users', user.uid, 'bankTransactions');
}

// Function to add a new bank transaction
export async function addBankTransaction(transactionData: NewBankTransaction) {
  if (!transactionData.branchId) {
    throw new Error("Branch ID is required to add a bank transaction.");
  }
  const bankCollectionRef = getBankCollectionRef();
  
  await addDoc(bankCollectionRef, {
    ...transactionData,
    createdAt: serverTimestamp(),
  });
}

// Function to get all bank transactions for a user's branch
export async function getBankTransactions(branchId: string): Promise<BankTransaction[]> {
  const bankCollectionRef = getBankCollectionRef();
  const q = query(
    bankCollectionRef,
    where('branchId', '==', branchId), 
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
