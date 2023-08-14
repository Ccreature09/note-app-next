"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import cat from "../images/cat.png";
import { onValue, ref, push, remove } from "firebase/database";
import { database } from "./firebase";

const shoppingListInDB = ref(database, "shoppingList");

export const List = () => {
	const [inputValue, setInputValue] = useState("");
	const [items, setItems] = useState([]);

	const addItem = () => {
		push(shoppingListInDB, inputValue);
		setInputValue("");
	};

	const removeItem = (itemId) => {
		const exactLocationOfItemInDB = ref(database, `shoppingList/${itemId}`);
		remove(exactLocationOfItemInDB);
	};

	useEffect(() => {
		const listRef = ref(database, "shoppingList");
		onValue(listRef, (snapshot) => {
			if (snapshot.exists()) {
				const listData = snapshot.val();
				const itemList = Object.entries(listData);
				setItems(itemList);
			} else {
				setItems([]);
			}
		});
	}, []);

	return (
		<div className="flex flex-col flex-grow max-w-xs my-8 mx-auto max-h-96">
			<Image
				width={160}
				height={160}
				src={cat}
				className="w-40 m-auto"
				alt=""
			/>
			<input
				className="block p-4 rounded-lg text-xl text-center mb-3 text-[#432000] bg-[#dce1eb]"
				type="text"
				placeholder="Bread"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
			/>
			<button
				onClick={addItem}
				className="p-4 rounded-lg text-xl text-center mb-3 text-[#fdfdfd] bg-[#ac485a]">
				Add to Cart
			</button>
			<ul className="list-none flex flex-wrap gap-3">
				{items.map(([itemId, itemValue]) => (
					<li
						key={itemId}
						onClick={() => removeItem(itemId)}
						className="hover:bg-[#ffecc7] transition-all duration-200 cursor-pointer text-xl bg-[#fffdf8] p-4 rounded-lg flex-grow text-center">
						{itemValue}
					</li>
				))}
			</ul>
		</div>
	);
};
