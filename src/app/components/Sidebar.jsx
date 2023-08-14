"use client";
import { useState } from "react";
import { GoogleAuth, GoogleAuthButton, SignOut } from "../firebase/GoogleAuth";
import { CreateList } from "./CreateList";

export const Sidebar = () => {
	const userInfo = GoogleAuth();

	const [userLists, setUserLists] = useState([
		{ id: 1, title: "Shopping List" },
		{ id: 2, title: "To-Do List" },
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

				{userInfo == null ? (
					<GoogleAuthButton></GoogleAuthButton>
				) : (
					<SignOut></SignOut>
				)}

				<CreateList addNewList={addNewList} userLists={userLists}></CreateList>

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
								className="text-gray-300 cursor-pointer hover:text-white mb-1 text-center"
								onClick={() => {
									setCurrList(list.id);
								}}>
								{list.title}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
