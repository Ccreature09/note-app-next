import { GoogleAuth } from "./firebase/GoogleAuth";
import { List } from "./firebase/database";

export default function Home() {
	return (
		<>
			<div>
				<List></List>

				<div className="absolute top-1 left-3 bg-gray-400 py-1 px-3 rounded-3xl flex">
					<img
						className="inline rounded-full h-20 w-20 mx-5"
						id="profile-picture"
						src=""
						alt=""
					/>
					<div>
						<h1 className="text-center text-4xl" id="display-name">
							Sign in!
						</h1>
						<h2 className="text-center text-2xl" id="email">
							Sign in!
						</h2>
					</div>
				</div>
			</div>

			<GoogleAuth></GoogleAuth>
		</>
	);
}
