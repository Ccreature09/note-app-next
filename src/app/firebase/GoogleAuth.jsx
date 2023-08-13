"use client";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged,
} from "firebase/auth";

export const GoogleAuth = () => {
	const [userInfo, setUserInfo] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const displayName = user.displayName;
				const email = user.email;
				const photoURL = user.photoURL;

				setUserInfo({ displayName, email, photoURL });
			} else {
				setUserInfo(null);
			}
		});

		return () => unsubscribe();
	}, []);

	return userInfo; // Return the userInfo object
};
