"use client";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";

export const GoogleAuthButton = () => {
	return (
		<button
			className="mb-4 border-none bg-[#457B9D] p-2 rounded font-medium text-[#F1FAEE]"
			onClick={async (e) => {
				const provider = await new GoogleAuthProvider();
				return signInWithPopup(auth, provider);
			}}>
			Sign In with Google
		</button>
	);
};

export const SignOut = () => {
	return (
		<button
			className="mb-4 border-none bg-[#457B9D] p-2 rounded font-medium text-[#F1FAEE]"
			onClick={async (e) => {
				try {
					await signOut(auth);
					setUser(null);
				} catch (error) {
					console.error("Error signing out:", error);
				}
			}}>
			Sign Out
		</button>
	);
};

export const GoogleAuth = () => {
	const [userInfo, setUserInfo] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const displayName = user.displayName;
				const email = user.email;
				const photoURL = user.photoURL;
				const uid = user.uid;

				setUserInfo({ displayName, email, photoURL, uid });
			} else {
				setUserInfo(null);
			}
		});

		return () => unsubscribe();
	}, []);

	return userInfo;
};
