"use client";
import { useState, useEffect } from "react";
import { List } from "./components/List";
import { Sidebar } from "./components/Sidebar";
import { Auth } from "./firebase/Auth";
import Image from "next/image";
import octupus from "./images/octupus.png";
import { Raleway } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"], weight: ["100"] });

export default function Home() {
	const [selectedListID, setSelectedListID] = useState({ listID: "", uid: "" });

	const [notificationPermission, setNotificationPermission] =
		useState("default");
	const userInfo = Auth();

	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/sw.js")
				.then((registration) => {
					console.log(
						"Service Worker registered with scope:",
						registration.scope
					);
				})
				.catch((error) => {
					console.error("Service Worker registration failed:", error);
				});
		}
		if ("Notification" in window) {
			Notification.requestPermission().then((permission) => {
				setNotificationPermission(permission);
			});
		}
	}, []);

	return (
		<>
			<style jsx global>{`
				html {
					font-family: ${raleway.style.fontFamily};
				}
			`}</style>
			<div className="flex flex-col md:flex-row bg-gradient-to-b from-[#A8DADC] to-[#1D3557] min-h-screen">
				<div>
					<Sidebar setSelectedListID={setSelectedListID} />
				</div>

				<div className="flex flex-col flex-grow max-w-xs h-auto mx-auto justify-center my-10">
					<Image
						width={160}
						height={160}
						src={octupus}
						className="w-32 h-32 mx-auto mb-5"
						alt=""
					/>

					<div className="flex justify-center md:items-center  w-full">
						{userInfo && <List listInfo={selectedListID} />}
					</div>
				</div>
			</div>
		</>
	);
}
