"use client";

import { useState, useEffect } from "react";
import { onValue, ref, push, remove } from "firebase/database";
import { database } from "../firebase/firebase";
import { Auth } from "../firebase/Auth";

export const List = ({ selectedListID }) => {
	const userInfo = Auth();
	const isAnonymous = userInfo && userInfo.isAnonymous;
	const uid = userInfo && userInfo.uid;

	const [inputValue, setInputValue] = useState("");
	const [error, setError] = useState("");
	const [items, setItems] = useState([]);
	const [reminderTime, setReminderTime] = useState("");

	const addItem = () => {
		const ListInDB = ref(
			database,
			`${userInfo.isAnonymous ? "guests" : "users"}/${
				userInfo.uid
			}/lists/${selectedListID}/items`
		);
		if (inputValue.trim() === "") {
			setError("Please enter a valid item.");
			return;
		}
		const reminderDate = new Date(reminderTime);

		const newReminder = {
			name: inputValue,
			time: reminderDate.getTime(),
			formattedTime: ` ${reminderDate.getDate()} of ${reminderDate.toLocaleString(
				"default",

				{
					month: "long",

					hour: "numeric",
					minute: "numeric",
					hour12: true,
				}
			)}`,
			notified: false,
		};
		const newNote = {
			name: inputValue,
		};

		if (reminderTime !== "") {
			push(ListInDB, newReminder);
		} else {
			push(ListInDB, newNote);
		}

		setInputValue("");
		setReminderTime("");
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
				isAnonymous ? "guests" : "users"
			}/${uid}/lists/${selectedListID}/items/${itemId}`
		);
		remove(exactLocationOfItemInDB);
	};

	useEffect(() => {
		const listRef = ref(
			database,
			`${isAnonymous ? "guests" : "users"}/${uid}/lists/${selectedListID}/items`
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
		`${isAnonymous ? "guests" : "users"}/${uid}/lists/${selectedListID}/items`,
	]);

	return (
		<>
			{selectedListID !== "default" && userInfo.uid && (
				<div>
					<div className="flex">
						<input
							className="block p-4 rounded-lg text-xl text-center mb-3 text-[#432000] w-full bg-[#F1FAEE]"
							type="text"
							placeholder="Bread"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={handleKeyPress}
							onFocus={handleInputFocus}
							maxLength={30}
						/>
						<input
							type="datetime-local"
							value={reminderTime}
							onChange={(e) => setReminderTime(e.target.value)}
							className="text-center w-12  text-5xl h-12"
						/>
					</div>

					{error && <p className="text-red-500">{error}</p>}
					<button
						onClick={addItem}
						className="p-4 rounded-lg text-xl text-center mb-3 text-[#fdfdfd] bg-[#457b9d] w-full">
						<p>Add to List</p>
					</button>
					<ul className="list-none flex flex-wrap gap-3">
						{items.map(([itemId, item]) => (
							<li
								key={itemId}
								onClick={() => removeItem(itemId)}
								className="hover:bg-[#E63946] transition-all duration-200 cursor-pointer text-xl bg-[#F1FAEE] p-4 rounded-lg flex-grow text-center">
								<div>{item.name}</div>
								{item.formattedTime && (
									<div className="text-blue-500">{item.formattedTime}</div>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
		</>
	);
};
