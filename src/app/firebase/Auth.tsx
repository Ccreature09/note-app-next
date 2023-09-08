import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import {
   GoogleAuthProvider,
   signInWithPopup,
   onAuthStateChanged,
   signOut,
   signInAnonymously,
   User
} from 'firebase/auth';

type UserInfo = {
   displayName?: string;
   email?: string | null; // Change the type to string | null
   photoURL?: string;
   uid?: string;
   isAnonymous?: boolean;
};

export const GoogleAuthButton: React.FC = () => {
   const userInfo = Auth();

   const handleAuthClick = async () => {
      if (userInfo) {
         try {
            await signOut(auth);
         } catch (error) {
            console.error('Error signing out:', error);
         }
      } else {
         try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
         } catch (error) {
            console.error('Error signing in:', error);
         }
      }
   };

   return (
      <button
         className={`mb-4 border-none  p-2 text-2xl rounded  text-[#F1FAEE] ${
            userInfo ? 'bg-red-500' : 'bg-green-500'
         }`}
         onClick={handleAuthClick}
      >
         {userInfo ? 'Sign Out' : 'Sign In with Google'}
      </button>
   );
};

export const GuestAuthButton: React.FC = () => {
   const guestInfo = Auth();

   const handleAuthClick = async () => {
      if (guestInfo) {
         try {
            if (guestInfo.isAnonymous) {
               await auth.currentUser?.delete();
            }
            await signOut(auth);
         } catch (error) {
            console.error('Error signing out:', error);
         }
      } else {
         try {
            await signInAnonymously(auth);
         } catch (error) {
            console.error('Error signing in:', error);
         }
      }
   };

   return (
      <button
         className="mb-4 border-none bg-gray-500 p-2 rounded text-2xl text-[#F1FAEE]"
         onClick={handleAuthClick}
      >
         {guestInfo ? 'Sign Out' : 'Sign In as Guest'}
      </button>
   );
};

export const Auth = () => {
   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
         if (user) {
            const uid = user.uid;
            const isAnonymous = user.isAnonymous;

            if (isAnonymous) {
               setUserInfo({ uid, isAnonymous });
            } else {
               const displayName = user.displayName || '';
               const email = user.email || '';
               const photoURL = user.photoURL || '';
               setUserInfo({ displayName, email, photoURL, uid, isAnonymous });
            }
         } else {
            setUserInfo(null);
         }
      });

      return () => unsubscribe();
   }, []);

   return userInfo;
};
