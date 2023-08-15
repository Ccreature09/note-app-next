"use client";
import { useState } from "react";
import { GoogleAuth, GoogleAuthButton, SignOut } from "../firebase/GoogleAuth";
import { CreateList } from "./CreateList";
import { List } from "../firebase/List";

export const Sidebar = ({ setSelectedListID }) => {
	const userInfo = GoogleAuth();
	const [activeListItem, setActiveListItem] = useState("");
	const [userLists, setUserLists] = useState([]);

	const addNewList = (newList) => {
		setUserLists((prevLists) => [...prevLists, newList]);
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
								className={`transition-all duration-100 cursor-pointer text-xl p-3 mb-3 rounded-lg flex-grow text-center ${
									activeListItem === list.id
										? "bg-[#457B9D]"
										: "bg-[#1D3557] hover:bg-[#457B9D]"
								}`}
								onClick={() => {
									setActiveListItem(list.id);
									setSelectedListID(list.id);
									console.log(setSelectedListID);
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
