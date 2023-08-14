import { List } from "./firebase/database";
import { Sidebar } from "./components/Sidebar";

export default function Home() {
	return (
		<>
			<div className="flex">
				<Sidebar></Sidebar>
				<List></List>
			</div>
		</>
	);
}
