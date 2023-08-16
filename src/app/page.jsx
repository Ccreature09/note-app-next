"use client";
import { useState } from "react";
import { List } from "./firebase/List";
import { Sidebar } from "./components/Sidebar";
import { GoogleAuth } from "./firebase/GoogleAuth";
import Head from "next/head";
export default function Home() {
	const [selectedListID, setSelectedListID] = useState("default");
	const userInfo = GoogleAuth();

	return (
		<>
			<Head>
				<link rel="icon" href="public\octopod.ico" />
			</Head>

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
