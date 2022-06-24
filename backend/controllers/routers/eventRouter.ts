import express from "express";
import { userList, userInfo } from "../../models/types";
import {
	getEventInfo,
	insertEventInfo,
	updateEventInfo,
	checkEventInfo,
	checkEventLimit
} from "../../models/eventModel";
import { loginBanCheck } from "../middleware/authMiddleware";


export const eventRouter = express.Router();

eventRouter.get("/list", loginBanCheck, async (req: any, res: any) => {
	try {
		const idx = userList.findIndex(
			(user: userInfo) => user.access === req.session.passport.user.access
		);
		getEventInfo(userList[idx].intra_id).then((resp: any) => {
			res.send(resp);
		});

	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});

eventRouter.post("/lent", loginBanCheck, async (req: any, res: any) => {
	try {
		// 특정 조건 추가할 것
		const idx = userList.findIndex(
			(user: userInfo) => user.access === req.session.passport.user.access
		);
		if (await checkEventLimit() === true) {
			await insertEventInfo(userList[idx].intra_id);
		}
		// if (new Date(2022, 4, 16, 9, 0, 0) > new Date()){
		// 	return res.sendStatus(200);
		// }
		// const date = new Date();
		// const hour = date.getHours();
		// const miniutes = date.getMinutes();
		// if (hour === miniutes) {
		// 	await insertEventInfo(userList[idx].intra_id);
		// }
		res.sendStatus(200);
		// 이벤트 당첨 조건 충족시 => event 테이블 조회 후 당첨자 정보 반환
	} catch (e) {
		console.log(e);
		res.status(200).json({ status: false });
	}
});

eventRouter.post("/return", loginBanCheck, async (req: any, res: any) => {
	try {
		// 특정 조건 추가할 것
		const idx = userList.findIndex(
			(user: userInfo) => user.access === req.session.passport.user.access
		);
		updateEventInfo(userList[idx].intra_id).then((resp: any) => {
			res.sendStatus(200);
		});

		// 이벤트 당첨 조건 충족시 => event 테이블 조회 후 당첨자 정보 반환
	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});

//이벤트 당첨자
eventRouter.get("/winner", loginBanCheck, async (req: any, res: any) => {
	try {
		const idx = userList.findIndex(
			(user: userInfo) => user.access === req.session.passport.user.access
		);
		checkEventInfo(userList[idx].intra_id).then((resp: any) => {
			if (resp == true) {
				res.status(200).send({winner: true});
			}
			else {
				res.status(200).send({winner: false});
			}
		});

		// 이벤트 당첨 조건 충족시 => event 테이블 조회 후 당첨자 정보 반환
	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});
