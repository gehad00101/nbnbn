
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, orderBy } from 'firebase/firestore';
import { getCurrentUser } from '@/utils/auth';

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  branchId: string;
}

export interface NewExpense {
  description: string;
  category: string;
  amount: number;
  date: string;
  branchId: string;
}

// Function to add a new expense
export async function addExpense(expenseData: NewExpense) {
  const user = await getCurrentUser();
  const expensesCollectionRef = collection(db, 'users', user.uid, 'expenses');
  
  await addDoc(expensesCollectionRef, {
    ...expenseData,
    createdAt: serverTimestamp(),
    userId: user.uid,
  });
}

// Function to get all expenses for a specific branch
export async function getExpensesForBranch(branchId: string): Promise<Expense[]> {
  const user = await getCurrentUser();
  const expensesCollectionRef = collection(db, 'users', user.uid, 'expenses');
  const q = query(
    expensesCollectionRef, 
    where('branchId', '==', branchId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const expenses: Expense[] = [];
  querySnapshot.forEach((doc) => {
    expenses.push({ id: doc.id, ...doc.data() } as Expense);
  });

  return expenses;
}
