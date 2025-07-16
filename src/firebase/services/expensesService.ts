
import { db, auth } from '@/firebase/config';
import { collection, addDoc, getDocs, query, serverTimestamp, orderBy, where } from 'firebase/firestore';
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

const getExpensesCollectionRef = async () => {
    const user = await getCurrentUser();
    return collection(db, 'users', user.uid, 'expenses');
}

// Function to add a new expense
export async function addExpense(expenseData: NewExpense) {
  const expensesCollectionRef = await getExpensesCollectionRef();
  
  await addDoc(expensesCollectionRef, {
    ...expenseData,
    createdAt: serverTimestamp(),
  });
}

// Function to get all expenses for a user's branch
export async function getExpenses(branchId: string): Promise<Expense[]> {
  const expensesCollectionRef = await getExpensesCollectionRef();
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
