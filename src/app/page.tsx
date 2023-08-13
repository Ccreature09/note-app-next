import { List } from "./firebase/database";
import { Sidebar } from "./components/Sidebar";

export default function Home() {
	return (
		<>
			<div>
				<List></List>
				<Sidebar></Sidebar>
			</div>
		</>
	);
}
