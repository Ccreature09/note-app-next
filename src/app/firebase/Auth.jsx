"use client";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged,
	signOut,
	signInAnonymously,
} from "firebase/auth";

export const GoogleAuthButton = () => {
	const userInfo = Auth();

	const handleAuthClick = async (e) => {
		if (userInfo) {
			try {
				await signOut(auth);
			} catch (error) {
				console.error("Error signing out:", error);
			}
		} else {
			try {
				const provider = await new GoogleAuthProvider();
				await signInWithPopup(auth, provider);
			} catch (error) {
				console.error("Error signing in:", error);
			}
		}
	};

	return (
		<button
			className="mb-4 border-none bg-[#457B9D] p-2 rounded font-medium text-[#F1FAEE]"
			onClick={handleAuthClick}>
			{userInfo ? "Sign Out With Google" : "Sign In with Google"}
		</button>
	);
};

export const GuestAuthButton = () => {
	const guestInfo = Auth();

	const handleAuthClick = async (e) => {
		if (guestInfo) {
			try {
				await signOut(auth);
			} catch (error) {
				console.error("Error signing out:", error);
			}
		} else {
			try {
				await signInAnonymously(auth);
			} catch (error) {
				console.error("Error signing in:", error);
			}
		}
	};

	return (
		<button
			className="mb-4 border-none bg-[#457B9D] p-2 rounded font-medium text-[#F1FAEE]"
			onClick={handleAuthClick}>
			{guestInfo ? "Sign Out with Guest" : "Sign In with Guest"}
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
