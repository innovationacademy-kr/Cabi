import express from "express";
import {
	getEventInfo,
	insertEventInfo,
	updateEventInfo,
	checkEventInfo,
	checkEventLimit
} from "../../models/eventModel";
import { loginBanCheck } from "../middleware/authMiddleware";
import { verifyToken } from "../middleware/jwtMiddleware";


export const eventRouter = express.Router();

eventRouter.get("/list", loginBanCheck, async (req: any, res: any) => {
	try {
		const user = await verifyToken(req, res);
		if (user !== undefined) {
			getEventInfo(user.intra_id).then((resp: any) => {
				res.send(resp);
			});
		} else {
			res.status(400).json({ error: "Permission denied" });
		}
	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});

eventRouter.post("/lent", loginBanCheck, async (req: any, res: any) => {
	try {
		const user = await verifyToken(req, res);
		if (user !== undefined) {
			if (await checkEventLimit() === true) {
				await insertEventInfo(user.intra_id);
			}
			res.sendStatus(200);
		} else {
			res.status(400).json({ error: "Permission denied" });
		}
	} catch (e) {
		console.log(e);
		res.status(200).json({ status: false });
	}
});

eventRouter.post("/return", loginBanCheck, async (req: any, res: any) => {
	try {
		const user = await verifyToken(req, res);
		if (user !== undefined) {
			updateEventInfo(user.intra_id).then((resp: any) => {
				res.sendStatus(200);
			});
		} else {
			res.status(400).json({ error: "Permission denied" });
		}
	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});

//이벤트 당첨자
eventRouter.get("/winner", loginBanCheck, async (req: any, res: any) => {
	try {
		const user = await verifyToken(req, res);
		if (user !== undefined) {
			checkEventInfo(user.intra_id).then((resp: any) => {
				if (resp == true) {
					res.status(200).send({winner: true});
				}
				else {
					res.status(200).send({winner: false});
				}
			});
		} else {
			res.status(400).json({ error: "Permission denied" });
		}
	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});
