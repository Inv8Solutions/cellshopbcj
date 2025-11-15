import { auth, db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const checkAdminAuth = (): Promise<boolean> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            resolve(userData.role === 'admin');
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
};
