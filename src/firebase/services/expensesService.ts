
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, orderBy } from 'firebase/firestore';
import { getCurrentUser } from '@/utils/auth';

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
}

export interface NewExpense {
  description: string;
  category: string;
  amount: number;
  date: string;
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

// Function to get all expenses for a user
export async function getExpenses(): Promise<Expense[]> {
  const user = await getCurrentUser();
  const expensesCollectionRef = collection(db, 'users', user.uid, 'expenses');
  const q = query(
    expensesCollectionRef, 
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const expenses: Expense[] = [];
  querySnapshot.forEach((doc) => {
    expenses.push({ id: doc.id, ...doc.data() } as Expense);
  });

  return expenses;
}
