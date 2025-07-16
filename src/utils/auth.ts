
import { auth, db } from '@/firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const registerWithEmail = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });

  // Create user document in Firestore
  const userDocRef = doc(db, 'users', userCredential.user.uid);
  await setDoc(userDocRef, {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: displayName,
    createdAt: serverTimestamp(),
  });
  
  return userCredential;
};

export const loginWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  // Create or update user document in Firestore
  const userDocRef = doc(db, 'users', result.user.uid);
  await setDoc(userDocRef, {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.displayName,
    createdAt: serverTimestamp(),
    photoURL: result.user.photoURL,
  }, { merge: true }); // Merge to avoid overwriting existing data if user signs up differently

  return result;
};

export const logout = async (): Promise<void> => {
  return signOut(auth);
};
