"use client";
import { useState } from "react";
import { List } from "./firebase/List";
import { Sidebar } from "./components/Sidebar";
import { GoogleAuth } from "./firebase/GoogleAuth";
export default function Home() {
	const [selectedListID, setSelectedListID] = useState("default");
	const [uID, setUID] = useState(null);
	const userInfo = GoogleAuth();
	return (
		<>
			<div className="flex flex-col md:flex-row bg-gradient-to-b from-[#A8DADC] to-[#1D3557]">
				<div>
					<Sidebar setSelectedListID={setSelectedListID} />
				</div>

				<div className="flex justify-center md:items-center min-h-screen w-full">
					<List
						selectedListID={selectedListID}
						uID={userInfo && userInfo.uid}
					/>
				</div>
			</div>
		</>
	);
}
