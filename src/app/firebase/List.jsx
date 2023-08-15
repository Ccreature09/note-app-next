"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import octupus from "../images/octupus.png";
import { onValue, ref, push, remove } from "firebase/database";
import { database } from "./firebase";

export const List = ({ selectedListID }) => {
	console.log(selectedListID);

	const ListInDB = ref(database, selectedListID);

	const [inputValue, setInputValue] = useState("");
	const [items, setItems] = useState([]);

	const addItem = () => {
		push(ListInDB, inputValue);
		setInputValue("");
	};

	const removeItem = (itemId) => {
		const exactLocationOfItemInDB = ref(
			database,
			`${selectedListID}/${itemId}`
		);
		remove(exactLocationOfItemInDB);
	};

	useEffect(() => {
		const listRef = ref(database, selectedListID);
		onValue(listRef, (snapshot) => {
			if (snapshot.exists()) {
				const listData = snapshot.val();
				const itemList = Object.entries(listData);
				setItems(itemList);
			} else {
				setItems([]);
			}
		});
	}, [selectedListID]);

	return (
		<div className="flex flex-col flex-grow max-w-xs my-8 mx-auto max-h-96">
			<Image
				width={160}
				height={160}
				src={octupus}
				className="w-40 mx-auto mb-5"
				alt=""
			/>
			<input
				className="block p-4 rounded-lg text-xl text-center mb-3 text-[#432000] bg-[#F1FAEE]"
				type="text"
				placeholder="Bread"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
			/>
			<button
				onClick={addItem}
				className="p-4 rounded-lg text-xl text-center mb-3 text-[#fdfdfd] bg-[#457b9d]">
				Add to Cart
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
	);
};
