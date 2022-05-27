import bead from "../../img/eventImage/bead.jpeg"
import cabinet from "../../img/eventImage/cabinet.png"
import cola from "../../img/eventImage/cola.webp"
import goblin from "../../img/eventImage/goblin.jpeg"
import gongyou from "../../img/eventImage/gongyou.jpeg"
import logo_purple from "../../img/eventImage/logo_purple.png"
import ohilnam from "../../img/eventImage/ohilnam.jpeg"
import polarbear from "../../img/eventImage/polarbear.png"
import mario from "../../img/eventImage/mario-bros.png"
import mushroom from "../../img/eventImage/mushroom.png"

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
		case "42cabi":
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
