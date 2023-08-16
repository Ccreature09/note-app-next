"use client";
import { useState } from "react";
import { List } from "./firebase/List";
import { Sidebar } from "./components/Sidebar";

export default function Home() {
	const [selectedListID, setSelectedListID] = useState("default");

	return (
		<>
			<div className="flex flex-col md:flex-row bg-gradient-to-b from-[#A8DADC] to-[#1D3557]">
				<div>
					{/* Pass selectedListID to Sidebar */}
					<Sidebar setSelectedListID={setSelectedListID} />
				</div>

				<div className="flex justify-center md:items-center min-h-screen w-full">
					{/* Pass selectedListID to List */}
					<List selectedListID={selectedListID} />
				</div>
			</div>
		</>
	);
}
