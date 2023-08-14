"use client";
<<<<<<< HEAD:src/app/components/Sidebar.tsx
import { GoogleAuth, GoogleAuthButton, SignOut } from "../firebase/GoogleAuth";
import CreateList from "./CreateList"; // Remove curly braces
import { useState } from "react";
=======
import { GoogleAuth, GoogleAuthButton } from "../firebase/GoogleAuth";
>>>>>>> parent of e5dad6f (Responsive + Google Signing in and out):src/app/components/Sidebar.jsx

export const Sidebar = () => {
	const userInfo = GoogleAuth();
	const [userLists, setUserLists] = useState([
		{ id: 1, title: "Shopping List" },
		{ id: 2, title: "To-Do List" },
		// ... existing lists
	]);

	const addNewList = (newList) => {
		setUserLists((prevLists) => [...prevLists, newList]);
	};

	return (
		<div className="">
			<div className="flex flex-col p-4 bg-gray-800 md:h-screen w-full md:w-64">
				{userInfo && (
					<div className="flex items-center justify-center space-x-4 mb-6">
						<img
							src={userInfo.photoURL}
							alt="Profile"
							className="w-12 h-12 rounded-full"
						/>
						<div className="flex flex-col ">
							<p className="text-white font-semibold text-lg">
								{userInfo.displayName}
							</p>
							<p className="text-gray-300 text-sm truncate md:w-auto">
								{userInfo.email}
							</p>
						</div>
					</div>
				)}
<<<<<<< HEAD:src/app/components/Sidebar.tsx

				{userInfo == null ? (
					<GoogleAuthButton></GoogleAuthButton>
				) : (
					<SignOut></SignOut>
				)}

				<CreateList addNewList={addNewList} userLists={userLists}></CreateList>
=======
				<GoogleAuthButton></GoogleAuthButton>
				<button className="bg-blue-600 text-white py-2 px-4 rounded mb-4">
					Create List
				</button>
>>>>>>> parent of e5dad6f (Responsive + Google Signing in and out):src/app/components/Sidebar.jsx

				<div className="">
					<p className="text-white font-semibold mb-2 text-center">
						Your Lists:
					</p>
					<hr />
					<br />
					<ul>
						{userLists.map((list) => (
							<li
								key={list.id}
								className="text-gray-300 cursor-pointer hover:text-white mb-1 text-center">
								{list.title}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
