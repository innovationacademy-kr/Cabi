import express from "express";
import {
	getEventInfo,
	insertEventInfo,
	updateEventInfo,
	checkEventInfo,
	checkEventLimit
} from "../../models/eventModel";
import { userInfo, userList } from "../../models/types";
import { loginBanCheck } from "../middleware/authMiddleware";

export const eventRouter = express.Router();

eventRouter.get("/list", loginBanCheck, async (req: any, res: any) => {
	try {
		const idx = userList.findIndex(
			(user: userInfo) => user.access === req.session.passport.user.access
		);
		if (idx === -1) {
			res.status(400).send({ error: "Permission Denied" });
			return ;
		}
		getEventInfo(userList[idx].intra_id).then((resp: any) => {
			res.send(resp);
		});
	} catch (e) {
		// console.log(e);
		res.status(400).json({ error: e });
	}
});

eventRouter.post("/lent", loginBanCheck, async (req: any, res: any) => {
	try {
		const idx = userList.findIndex(
			(user: userInfo) => user.access === req.session.passport.user.access
		);
		if (idx === -1) {
			res.status(400).send({ error: "Permission Denied" });
			return ;
		}
		if (await checkEventLimit() === true) {
			await insertEventInfo(userList[idx].intra_id);
		}
		res.sendStatus(200);
	} catch (e) {
		// console.log(e);
		res.status(200).json({ status: false });
	}
});

eventRouter.post("/return", loginBanCheck, async (req: any, res: any) => {
	try {
		const idx = userList.findIndex(
			(user: userInfo) => user.access === req.session.passport.user.access
		);
		if (idx === -1) {
			res.status(400).send({ error: "Permission Denied" });
			return ;
		}
		updateEventInfo(userList[idx].intra_id).then((resp: any) => {
			res.sendStatus(200);
		});
	} catch (e) {
		// console.log(e);
		res.status(400).json({ error: e });
	}
});

//이벤트 당첨자
eventRouter.get("/winner", loginBanCheck, async (req: any, res: any) => {
	try {
		const idx = userList.findIndex(
			(user: userInfo) => user.access === req.session.passport.user.access
		);
		if (idx === -1) {
			res.status(400).send({ error: "Permission Denied" });
			return ;
		}
		checkEventInfo(userList[idx].intra_id).then((resp: any) => {
			if (resp == true) {
				res.status(200).send({winner: true});
			} else {
				res.status(200).send({winner: false});
			}
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});
