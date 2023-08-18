"use client";

import { useState, useEffect } from "react";

import { onValue, ref, push, remove } from "firebase/database";
import { database } from "../firebase/firebase";

import { GoogleAuth } from "../firebase/GoogleAuth";
import { GuestAuth } from "../firebase/GuestAuth";

export const List = ({ selectedListID }) => {
	const userInfo = GoogleAuth();
	const guestInfo = GuestAuth();

	const uidToUse = userInfo ? userInfo.uid : guestInfo && guestInfo.uid;

	const [inputValue, setInputValue] = useState("");
	const [error, setError] = useState("");
	const [items, setItems] = useState([]);

	const addItem = () => {
		const ListInDB = ref(
			database,
			`${
				guestInfo ? "guests" : userInfo && "users"
			}/${uidToUse}/lists/${selectedListID}/items`
		);
		if (inputValue.trim() === "") {
			setError("Please enter a valid item.");
			return;
		}

		push(ListInDB, inputValue);
		setInputValue("");
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			addItem();
		}
	};

	const handleInputFocus = () => {
		setError("");
	};

	const removeItem = (itemId) => {
		const exactLocationOfItemInDB = ref(
			database,
			`${
				guestInfo ? "guests" : userInfo && "users"
			}/${uidToUse}/lists/${selectedListID}/items/${itemId}`
		);
		remove(exactLocationOfItemInDB);
	};

	useEffect(() => {
		const listRef = ref(
			database,
			`${
				guestInfo ? "guests" : userInfo && "users"
			}/${uidToUse}/lists/${selectedListID}/items`
		);
		onValue(listRef, (snapshot) => {
			if (snapshot.exists()) {
				const listData = snapshot.val();
				const itemList = Object.entries(listData);
				setItems(itemList);
			} else {
				setItems([]);
			}
		});
	}, [
		`${
			guestInfo ? "guests" : userInfo && "users"
		}/${uidToUse}/lists/${selectedListID}/items`,
	]);

	return (
		<>
			{selectedListID != "default" && uidToUse && (
				<div>
					<input
						className="block p-4 rounded-lg text-xl text-center mb-3 text-[#432000] w-full bg-[#F1FAEE]"
						type="text"
						placeholder="Bread"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyPress}
						onFocus={handleInputFocus}
					/>
					{error && <p className="text-red-500">{error}</p>}
					<button
						onClick={addItem}
						className="p-4 rounded-lg text-xl text-center mb-3 text-[#fdfdfd] bg-[#457b9d] w-full">
						Add to List
					</button>
					<ul className="list-none flex flex-wrap gap-3">
						{items.map(([itemId, itemValue]) => (
							<li
								key={itemId}
								onClick={() => removeItem(itemId)}
								className="hover:bg-[#E63946] transition-all duration-200 cursor-pointer text-xl bg-[#F1FAEE] p-4 rounded-lg flex-grow text-center">
								{itemValue}
							</li>
						))}
					</ul>
				</div>
			)}
		</>
	);
};
