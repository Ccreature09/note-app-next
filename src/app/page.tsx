import { List } from "./firebase/List";
import { Sidebar } from "./components/Sidebar";

export default function Home() {
	return (
		<>
			<div className="flex flex-col md:flex-row">
				<div>
					<Sidebar></Sidebar>
				</div>

				<div className="flex justify-center md:items-center min-h-screen w-full">
					<List></List>
				</div>
			</div>
		</>
	);
}
