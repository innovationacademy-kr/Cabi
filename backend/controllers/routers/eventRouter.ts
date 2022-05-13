import express from "express";
import { userList, userInfo } from "../../models/userModel";
import {
	getEventInfo,
	insertEventInfo,
	updateEventInfo,
} from "../../models/eventModel";


export const eventRouter = express.Router();

eventRouter.get("/list", async (req: any, res: any) => {
	console.log("/list");
	try {
		if (!req.session || !req.session.passport || !req.session.passport.user) {
			res.status(400).send({ error: "Permission Denied" });
			return;
		}
		const idx = userList.findIndex(
			(user: userInfo) => user.access === req.session.passport.user.access
		);
		if (idx === -1) {
			res.status(400).send({ error: "Permission Denied" });
			return;
		}
		getEventInfo(userList[idx].intra_id).then((resp: any) => {
			res.send(resp);
		});

	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});

eventRouter.post("/lent", async (req: any, res: any) => {
	console.log("/lent");

	try {
		if (!req.session || !req.session.passport || !req.session.passport.user) {
			res.status(400).send({ error: "Permission Denied" });
			return;
		}
		const idx = userList.findIndex(
			(user: userInfo) => user.access === req.session.passport.user.access
		);
		if (idx === -1) {
			res.status(400).send({ error: "Permission Denied" });
			return;
		}
		// 특정 조건 추가할 것
		const date = new Date();
		const miniutes = date.getMinutes();
		const seconds = date.getSeconds();
		console.log(miniutes);
		console.log(seconds);
		if (miniutes === seconds) {
			insertEventInfo(userList[idx].intra_id).then((resp: any) => {
				res.sendStatus(200);
			});
		}

		// 이벤트 당첨 조건 충족시 => event 테이블 조회 후 당첨자 정보 반환
	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});

eventRouter.post("/return", async (req: any, res: any) => {
	console.log("/return");

	try {
		if (!req.session || !req.session.passport || !req.session.passport.user) {
			res.status(400).send({ error: "Permission Denied" });
			return;
		}
		const idx = userList.findIndex(
			(user: userInfo) => user.access === req.session.passport.user.access
		);
		if (idx === -1) {
			res.status(400).send({ error: "Permission Denied" });
			return;
		}

		// 특정 조건 추가할 것
		updateEventInfo(userList[idx].intra_id).then((resp: any) => {
			res.sendStatus(200);
		});

		// 이벤트 당첨 조건 충족시 => event 테이블 조회 후 당첨자 정보 반환
	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});
