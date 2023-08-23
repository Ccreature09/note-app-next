import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { database } from "../firebase/firebase";
import { Auth } from "../firebase/Auth";

export const CreateList = () => {
	const userInfo = Auth();

	const [showOverlay, setShowOverlay] = useState(false);
	const [listName, setListName] = useState("");
	const [listType, setListType] = useState("individual");
	const [listMembers, setListMembers] = useState([]);
	const [error, setError] = useState("");
	const [reminders, setReminders] = useState([]);
	const [reminderName, setReminderName] = useState("");
	const [reminderTime, setReminderTime] = useState("");
	const [enteredMember, setEnteredMember] = useState("");

	const addReminder = () => {
		if (reminderName.trim() === "" || !reminderTime) {
			setError("Please enter a valid reminder name and time.");
			return;
		}

		const newReminder = {
			name: reminderName,
			time: reminderTime,
			notified: false,
		};

		setReminders([...reminders, newReminder]);
		setReminderName("");
		setReminderTime("");
	};

	const toggleOverlay = () => {
		setShowOverlay(!showOverlay);
		setError("");
	};
	const addMemberToList = () => {
		if (!listMembers.includes(enteredMember)) {
			setListMembers([...listMembers, enteredMember]);
			setEnteredMember("");
		}
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
			members: listMembers,
		};

		let listsRef;

		if (userInfo) {
			listsRef = ref(
				database,
				`${userInfo.isAnonymous ? "guests" : "users"}/${userInfo.uid}/lists`
			);
		}

		const listRef = push(listsRef);
		newList.id = listRef.key;

		set(listRef, newList);

		toggleOverlay();
	};

	return (
		<div className="relative">
			{userInfo && (
				<button
					onClick={toggleOverlay}
					className="mb-4 border-none bg-[#70A9A1] p-2 rounded font-medium text-[#F1FAEE] w-full">
					Create List
				</button>
			)}

			{showOverlay && userInfo && (
				<div className="fixed top-0 left-0 w-full h-full bg-[rgba(60,84,150,0.48)] flex justify-center items-center">
					<div className={"z-1 bg-white rounded-xl p-10 w-full max-w-lg"}>
						<div className="popup ">
							<p className="text-center text-7xl mb-12 font-bold">
								What is the list&apos;s name?
							</p>
							<input
								type="text"
								placeholder="Shopping List"
								value={listName}
								onChange={(e) => setListName(e.target.value)}
								className="text-center w-full text-5xl mb-10"
							/>
							{error && <p className="text-red-500">{error}</p>}
							<div className="flex">
								<label className="w-1/2 mx-2 bg-slate-200 rounded-2xl">
									<input
										className="w-full"
										type="radio"
										name="listType"
										value="individual"
										checked={listType === "individual"}
										onChange={() => setListType("individual")}
									/>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-full h-6">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
										/>
									</svg>
									<p className="text-center">Individual</p>
								</label>
								<label className="w-1/2 mx-2 bg-slate-200 rounded-2xl">
									<input
										className="w-full"
										type="radio"
										name="listType"
										value="group"
										checked={listType === "group"}
										onChange={() => setListType("group")}
									/>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-full h-6">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
										/>
									</svg>
									<p className="text-center">Group</p>
								</label>
							</div>
							{listType === "group" && (
								<div className="mt-4">
									<h3 className="text-lg font-semibold mb-2">
										List Members (seperate with comma):
									</h3>
									<ul>
										{listMembers.map((member, index) => (
											<li key={index}>{member}</li>
										))}
									</ul>
									<input
										type="text"
										placeholder="Enter user email/username"
										value={listMembers.join(",")}
										onChange={(e) => setListMembers(e.target.value.split(","))}
										className="text-center w-full text-5xl mb-10"
									/>
									<button
										className="bg-blue-600 text-white p-2  rounded w-full"
										onClick={addMemberToList}>
										Add User
									</button>
								</div>
							)}

							<div className="flex mt-3">
								<button
									className="bg-blue-600 text-white p-2 mx-2 rounded w-1/2"
									onClick={handleCreateList}>
									Create List
								</button>
								<button
									className="bg-blue-600 text-white p-2  mx-2 rounded w-1/2"
									onClick={toggleOverlay}>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
