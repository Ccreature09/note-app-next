import React, { useState } from "react";
import { onValue, ref, push, remove, set } from "firebase/database";
import { database } from "../firebase/firebase";

export const CreateList = ({ addNewList, userLists }) => {
	const [showOverlay, setShowOverlay] = useState(false);
	const [listName, setListName] = useState("");
	const [listType, setListType] = useState("individual");

	const toggleOverlay = () => {
		setShowOverlay(!showOverlay);
	};

	const handleCreateList = () => {
		const newList = {
			id: 0,
			title: listName,
			type: listType,
		};

		// Create a reference to the "lists" directory
		const listsRef = ref(database, "lists");

		// Push the new list to the "lists" directory and get the new reference
		const listRef = push(listsRef);

		newList.id = listRef.key;

		// Set the data at the new reference using set
		set(listRef, newList);

		addNewList(newList);
		toggleOverlay();
	};

	return (
		<div className="relative">
			<button
				onClick={toggleOverlay}
				className="bg-[#70A9A1] text-white py-2 px-4 rounded mb-4 w-full">
				Create List
			</button>
			{showOverlay && (
				<div className="overlay bg-white p-4 rounded-xl">
					<div className="popup">
						<h2>Create a New List</h2>
						<input
							type="text"
							placeholder="Enter List Name"
							value={listName}
							onChange={(e) => setListName(e.target.value)}
							className="w-48"
						/>
						<label>
							<input
								type="radio"
								name="listType"
								value="individual"
								checked={listType === "individual"}
								onChange={() => setListType("individual")}
							/>{" "}
							Individual
						</label>
						<label>
							<input
								type="radio"
								name="listType"
								value="group"
								checked={listType === "group"}
								onChange={() => setListType("group")}
							/>{" "}
							Group
						</label>
						<button
							className="bg-blue-600 text-white py-2 px-2 rounded mb-4"
							onClick={handleCreateList}>
							Create List
						</button>
						<button
							className="bg-blue-600 text-white py-2 px-2 m-3 rounded mb-4"
							onClick={toggleOverlay}>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
