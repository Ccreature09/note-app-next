"use client";
import { useState } from "react";
import { List } from "./firebase/List";
import { Sidebar } from "./components/Sidebar";
import { GoogleAuth } from "./firebase/GoogleAuth";
import Image from "next/image";
import octupus from "./images/octupus.png";

export default function Home() {
	const [selectedListID, setSelectedListID] = useState("default");
	const [uid, setUid] = useState(null);
	const userInfo = GoogleAuth();
	const uidToUse = userInfo ? userInfo.uid : uid;

	return (
		<>
			<div className="flex flex-col md:flex-row bg-gradient-to-b from-[#A8DADC] to-[#1D3557]">
				<div>
					<Sidebar setSelectedListID={setSelectedListID} uid={setUid} />
				</div>

				<div className="flex flex-col flex-grow max-w-xs my-8 mx-auto max-h-96">
					<Image
						width={160}
						height={160}
						src={octupus}
						className="w-40 mx-auto mb-5"
						alt=""
					/>
					<div className="flex justify-center md:items-center min-h-screen w-full">
						{uidToUse && (
							<List selectedListID={selectedListID} uID={uidToUse} />
						)}
					</div>
				</div>
			</div>
		</>
	);
}
