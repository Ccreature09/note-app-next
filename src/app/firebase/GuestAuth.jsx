"use client";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";

export const GuestAuthButton = () => {
	const guestInfo = GuestAuth();

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

export const GuestAuth = () => {
	const [guestInfo, setGuestInfo] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user && user.isAnonymous) {
				const uid = user.uid;
				const isAnonymous = user.isAnonymous;

				setGuestInfo({ uid, isAnonymous });
			} else {
				setGuestInfo(null);
			}
		});

		return () => unsubscribe();
	}, []);

	return guestInfo;
};
