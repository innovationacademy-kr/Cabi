import bead from "./bead.jpeg"
import cabinet from "./cabinet.png"
import cola from "./cola.webp"
import goblin from "./goblin.jpeg"
import gongyou from "./gongyou.jpeg"
import logo_purple from "./logo_purple.png"
import ohilnam from "./ohilnam.jpeg"
import polarbear from "./polarbear.png"
import mario from "./mario-bros.png"
import mushroom from "./mushroom.png"

const ReturnEventImage = (name: string) => {
	switch (name) {
		case "bead":
			return bead;
		case "cabinet":
			return cabinet;
		case "cola":
			return cola;
		case "goblin":
			return goblin;
		case "gongyou":
			return gongyou;
		case "logo_purple":
			return logo_purple;
		case "ohilnam":
			return ohilnam;
		case "polarbear":
			return polarbear;
		case "mushroom":
			return mushroom;
		case "mario":
			return mario;
		default:
			return null;
	}
};

export default ReturnEventImage;