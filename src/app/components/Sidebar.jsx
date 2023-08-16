"use client";
import { useState, useEffect } from "react";
import { GoogleAuth, Auth } from "../firebase/GoogleAuth";
import { CreateList } from "./CreateList";
import { ref, remove, onValue, update } from "firebase/database";
import { database } from "../firebase/firebase";

export const Sidebar = ({ setSelectedListID }) => {
	const userInfo = GoogleAuth();
	const [activeListItem, setActiveListItem] = useState("");
	const [userLists, setUserLists] = useState([]);

	useEffect(() => {
		if (userInfo) {
			const uid = ref(database, `users/${userInfo.uid}`);
			update(uid, { ["Name"]: userInfo.displayName });

			const userListsRef = ref(database, `users/${userInfo.uid}/lists`);
			onValue(userListsRef, (snapshot) => {
				if (snapshot.exists()) {
					const lists = snapshot.val();
					const listsArray = Object.values(lists);
					setUserLists(listsArray);
				} else {
					setUserLists([]);
				}
			});
		} else {
			setUserLists([]);
			setSelectedListID("default");
		}
	}, [userInfo]);

	const removeList = (listId) => {
		setSelectedListID("default"); // Reset selectedListID to "default"

		setUserLists((prevLists) => prevLists.filter((list) => list.id !== listId));

		const listRef = ref(database, `users/${userInfo.uid}/lists/${listId}`);
		remove(listRef);
	};

	return (
		<div className="">
			<div className="flex flex-col p-4 bg-[#1D3557] md:h-screen w-full md:w-64">
				{userInfo && (
					<div className="flex items-center justify-center space-x-4 mb-6">
						<img
							src={userInfo.photoURL}
							alt="Profile"
							className="w-12 h-12 rounded-full"
						/>
						<div className="flex flex-col ">
							<p className="text-[#F1FAEE] font-semibold text-lg">
								{userInfo.displayName}
							</p>
							<p className="text-[#F1FAEE] text-sm truncate md:w-auto">
								{userInfo.email}
							</p>
						</div>
					</div>
				)}

				<Auth></Auth>

				{userInfo && (
					<CreateList
						userLists={userLists}
						uid={userInfo && userInfo.uid}></CreateList>
				)}

				<div className="">
					{userLists.length > 0 && (
						<div>
							<p className="text-[#F1FAEE] font-semibold mb-2 text-center">
								Your Lists:
							</p>

							<hr />
							<br />
						</div>
					)}

					<ul>
						{userLists.map((list) => (
							<div
								className="flex items-center justify-between p-4"
								key={list.id}>
								<li
									className={`transition-all duration-200 cursor-pointer text-xl p-3 mb-3 rounded-lg flex-grow text-center text-[#F1FAEE] max-w-2xl overflow-auto ${
										activeListItem === list.id
											? "bg-[#457B9D]"
											: "bg-[#1D3557] hover:bg-[#457B9D]"
									}`}
									onClick={() => {
										setActiveListItem(list.id);
										setSelectedListID(list.id);
									}}>
									{list.title}
								</li>
								<button
									className="ml-2 text-red-500 bg-[#1D3557] p-1.5 mb-3 rounded"
									onClick={(e) => {
										e.stopPropagation();
										removeList(list.id);
									}}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="w-9 h-9 item hover:bg-[#457B9D] p-2 rounded transition-all duration-200">
										<path
											fillRule="evenodd"
											d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
