"use client";
import { useState } from "react";
import { List } from "./components/List";
import { Sidebar } from "./components/Sidebar";
import { Auth } from "./firebase/Auth";
import Image from "next/image";
import octupus from "./images/octupus.png";

export default function Home() {
	const [selectedListID, setSelectedListID] = useState("default");
	const [guestUid, setGuestUid] = useState(null);
	const userInfo = Auth();

	return (
		<>
			<div className="flex flex-col md:flex-row bg-gradient-to-b from-[#A8DADC] to-[#1D3557]">
				<div>
					<Sidebar setSelectedListID={setSelectedListID} uid={setGuestUid} />
				</div>

				<div className="flex flex-col flex-grow max-w-xs h-auto mx-auto justify-center">
					<Image
						width={160}
						height={160}
						src={octupus}
						className="w-40 mx-auto mb-5"
						alt=""
					/>

					<div className="flex justify-center md:items-center  w-full">
						{userInfo && (
							<List selectedListID={selectedListID} uID={userInfo.uid} />
						)}
					</div>
				</div>
			</div>
		</>
	);
}
