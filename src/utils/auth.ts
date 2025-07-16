
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/firebase/config";

export function getCurrentUser(): Promise<User> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        reject(new Error("User is not authenticated."));
      }
    });
  });
}
