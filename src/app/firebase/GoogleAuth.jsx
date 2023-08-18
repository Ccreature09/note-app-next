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
	const userInfo = GoogleAuth();

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

export const GoogleAuth = () => {
	const [userInfo, setUserInfo] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				if (user.providerData[0]?.providerId == "google.com") {
					console.log("google.com");
					const displayName = user.displayName;
					const email = user.email;
					const photoURL = user.photoURL;
					const uid = user.uid;

					setUserInfo({ displayName, email, photoURL, uid });
				}
			} else {
				setUserInfo(null);
			}
		});

		return () => unsubscribe();
	}, []);

	return userInfo;
};
