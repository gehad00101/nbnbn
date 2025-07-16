
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { db } from '@/firebase/config';
import { collection, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc, query, orderBy, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface Branch {
  id: string;
  name: string;
  createdAt?: any;
}

interface BranchContextType {
  branches: Branch[];
  selectedBranch: Branch | null;
  loading: boolean;
  addBranch: (name: string) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  selectBranch: (id: string) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

const FAKE_USER_ID = 'default-user';

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const branchesCollectionRef = collection(db, 'users', FAKE_USER_ID, 'branches');
    const q = query(branchesCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Create a default branch if none exist for a logged-in user
        try {
          const defaultBranch = { name: 'الفرع الرئيسي', createdAt: serverTimestamp() };
          const newBranchRef = await addDoc(branchesCollectionRef, defaultBranch);
          const newBranch = { id: newBranchRef.id, ...defaultBranch };
          setBranches([newBranch]);
          setSelectedBranch(newBranch);
          localStorage.setItem(`selectedBranchId_${FAKE_USER_ID}`, newBranch.id);
        } catch(error) {
           console.error("Error creating default branch: ", error);
        } finally {
           setLoading(false);
        }
        return;
      }

      const branchesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
      setBranches(branchesData);

      const lastSelectedBranchId = localStorage.getItem(`selectedBranchId_${FAKE_USER_ID}`);
      const foundBranch = branchesData.find(b => b.id === lastSelectedBranchId);
      
      const branchToSelect = foundBranch || branchesData[0];
      
      if (branchToSelect) {
        setSelectedBranch(branchToSelect);
        localStorage.setItem(`selectedBranchId_${FAKE_USER_ID}`, branchToSelect.id);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching branches: ", error);
      toast({ title: "خطأ في جلب الفروع", description: error.message, variant: "destructive" });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const addBranch = async (name: string) => {
    const branchesCollectionRef = collection(db, 'users', FAKE_USER_ID, 'branches');
    await addDoc(branchesCollectionRef, {
      name: name,
      createdAt: serverTimestamp(),
    });
  };

  const deleteBranch = async (id: string) => {
    const branchDocRef = doc(db, 'users', FAKE_USER_ID, 'branches', id);
    await deleteDoc(branchDocRef);
    if(selectedBranch?.id === id) {
        localStorage.removeItem(`selectedBranchId_${FAKE_USER_ID}`);
        const newSelected = branches.find(b => b.id !== id) || null;
        setSelectedBranch(newSelected);
        if (newSelected) {
            localStorage.setItem(`selectedBranchId_${FAKE_USER_ID}`, newSelected.id);
        }
    }
  };

  const selectBranch = useCallback((id: string) => {
    const branch = branches.find(b => b.id === id);
    if (branch) {
      setSelectedBranch(branch);
      localStorage.setItem(`selectedBranchId_${FAKE_USER_ID}`, id);
    }
  }, [branches]);

  const value = {
    branches,
    selectedBranch,
    loading,
    addBranch,
    deleteBranch,
    selectBranch,
  };

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
};
