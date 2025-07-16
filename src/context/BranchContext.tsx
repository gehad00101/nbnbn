
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { db } from '@/firebase/config';
import { collection, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
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

  const branchesCollectionRef = collection(db, 'branches');

  useEffect(() => {
    setLoading(true);
    const q = query(branchesCollectionRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const branchesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
      setBranches(branchesData);

      if (branchesData.length > 0) {
        const lastSelectedBranchId = localStorage.getItem('selectedBranchId');
        const foundBranch = branchesData.find(b => b.id === lastSelectedBranchId);
        
        if (foundBranch) {
          setSelectedBranch(foundBranch);
        } else {
          setSelectedBranch(branchesData[0]);
          localStorage.setItem('selectedBranchId', branchesData[0].id);
        }
      } else {
        setSelectedBranch(null);
        localStorage.removeItem('selectedBranchId');
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching branches: ", error);
      toast({ title: "خطأ في جلب الفروع", description: error.message, variant: "destructive" });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addBranch = async (name: string) => {
    await addDoc(branchesCollectionRef, {
      name: name,
      createdAt: serverTimestamp(),
    });
  };

  const deleteBranch = async (id: string) => {
    const branchDocRef = doc(db, 'branches', id);
    await deleteDoc(branchDocRef);
    if(selectedBranch?.id === id) {
        localStorage.removeItem('selectedBranchId');
        if(branches.length > 1) {
            const newSelectedBranch = branches.find(b => b.id !== id);
            if(newSelectedBranch) {
                 setSelectedBranch(newSelectedBranch);
                 localStorage.setItem('selectedBranchId', newSelectedBranch.id);
            }
        } else {
            setSelectedBranch(null);
        }
    }
  };

  const selectBranch = useCallback((id: string) => {
    const branch = branches.find(b => b.id === id);
    if (branch) {
      setSelectedBranch(branch);
      localStorage.setItem('selectedBranchId', id);
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
