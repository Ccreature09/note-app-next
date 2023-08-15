import React, { useState } from "react";
import { onValue, ref, push, remove, set } from "firebase/database";
import { database } from "../firebase/firebase";

export const CreateList = ({ addNewList, userLists }) => {
	const [showOverlay, setShowOverlay] = useState(false);
	const [listName, setListName] = useState("");
	const [listType, setListType] = useState("individual");
	const [error, setError] = useState("");

	const toggleOverlay = () => {
		setShowOverlay(!showOverlay);
		setError("");
	};

	const handleCreateList = () => {
		if (listName.trim() === "") {
			setError("Please enter a valid list name.");
			return;
		}

		const newList = {
			id: "",
			title: listName,
			type: listType,
		};

		const listsRef = ref(database, "lists");

		const listRef = push(listsRef);

		newList.id = listRef.key;

		set(listRef, newList);

		addNewList(newList);
		toggleOverlay();
	};

	return (
		<div className="relative">
			<button
				onClick={toggleOverlay}
				className="mb-4 border-none bg-[#70A9A1] p-2 rounded font-medium text-[#F1FAEE] w-full">
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
						{error && <p className="text-red-500">{error}</p>}
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
