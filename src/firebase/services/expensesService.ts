
import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy } from 'firebase/firestore';

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

const getExpensesCollectionRef = () => {
    // We are using a hard-coded user ID because auth has been removed.
    const userId = 'default-user';
    return collection(db, 'users', userId, 'expenses');
}

// Function to add a new expense
export async function addExpense(expenseData: NewExpense) {
  const expensesCollectionRef = getExpensesCollectionRef();
  
  await addDoc(expensesCollectionRef, {
    ...expenseData,
    createdAt: serverTimestamp(),
  });
}

// Function to get all expenses for a user
export async function getExpenses(): Promise<Expense[]> {
  const expensesCollectionRef = getExpensesCollectionRef();
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
