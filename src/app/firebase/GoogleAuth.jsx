"use client";
import { auth } from "./firebase";
import {
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged,
} from "firebase/auth";

onAuthStateChanged(auth, (user) => {
	if (user) {
		const displayName = user.displayName;
		const email = user.email;
		const photoURL = user.photoURL;

		// Display user information
		document.getElementById("display-name").textContent = displayName;
		document.getElementById("email").textContent = email;
		document.getElementById("profile-picture").src = photoURL;
	} else {
		// No user is signed in
		console.log("No user is signed in.");
	}
});

export const GoogleAuth = () => {
	return (
		<button
			className="absolute top-3 right-3 border-none bg-white p-2 rounded font-medium text-[#757575]"
			onClick={async (e) => {
				const provider = await new GoogleAuthProvider();
				return signInWithPopup(auth, provider);
			}}>
			Sign In with Google
		</button>
	);
};
