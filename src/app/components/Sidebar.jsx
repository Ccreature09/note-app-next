"use client";
import { GoogleAuth } from "../firebase/GoogleAuth";

export const Sidebar = () => {
	const userInfo = GoogleAuth();
	const userLists = [
		{ id: 1, title: "Shopping List" },
		{ id: 2, title: "To-Do List" },
		// Add more lists here
	];

	return (
		<div className="">
			<div className="flex flex-col p-4 bg-gray-800 h-screen">
				{userInfo && (
					<div className="flex items-center space-x-4 mb-6">
						<img
							src={userInfo.photoURL}
							alt="Profile"
							className="w-12 h-12 rounded-full"
						/>
						<div>
							<p className="text-white font-semibold">{userInfo.displayName}</p>
							<p className="text-gray-300">{userInfo.email}</p>
						</div>
					</div>
				)}

				<button className="bg-blue-600 text-white py-2 px-4 rounded mb-4">
					Create List
				</button>

				<div>
					<p className="text-white font-semibold mb-2">Your Lists:</p>
					<ul>
						{userLists.map((list) => (
							<li
								key={list.id}
								className="text-gray-300 cursor-pointer hover:text-white mb-1">
								{list.title}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
