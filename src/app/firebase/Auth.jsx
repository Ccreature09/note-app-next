'use client';
import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import {
   GoogleAuthProvider,
   signInWithPopup,
   onAuthStateChanged,
   signOut,
   signInAnonymously
} from 'firebase/auth';

export const GoogleAuthButton = () => {
   const userInfo = Auth();

   const handleAuthClick = async (e) => {
      if (userInfo) {
         try {
            await signOut(auth);
         } catch (error) {
            console.error('Error signing out:', error);
         }
      } else {
         try {
            const provider = await new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
         } catch (error) {
            console.error('Error signing in:', error);
         }
      }
   };

   return (
      <button
         className="mb-4 border-none bg-green-500 p-2 text-2xl rounded  text-[#F1FAEE]"
         onClick={handleAuthClick}
      >
         {userInfo ? 'Sign Out' : 'Sign In with Google'}
      </button>
   );
};

export const GuestAuthButton = () => {
   const guestInfo = Auth();

   const handleAuthClick = async (e) => {
      if (guestInfo) {
         try {
            if (guestInfo.isAnonymous) {
               // Delete the anonymous account before signing out
               await auth.currentUser.delete();
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
   const [userInfo, setUserInfo] = useState(null);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (user) {
            const uid = user.uid;
            const isAnonymous = user.isAnonymous;

            if (isAnonymous) {
               setUserInfo({ uid, isAnonymous });
            } else {
               const displayName = user.displayName;
               const email = user.email;
               const photoURL = user.photoURL;
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
