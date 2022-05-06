import { userList, userInfo } from "../../models/userModel";
import { userRouter } from "./userRouter";
import {
  getEventInfo,
  insertEventInfo,
  updateEventInfo,
} from "../../models/eventModel";

userRouter.get("/api/event/list", async (req: any, res: any) => {
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
  
  userRouter.post("/api/event/lent", async (req: any, res: any) => {
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
	  insertEventInfo(userList[idx].intra_id).then((resp: any) => {
		res.sendStatus(200);
	  });
  
	// 이벤트 당첨 조건 충족시 => event 테이블 조회 후 당첨자 정보 반환
	} catch (e) {
	  console.log(e);
	  res.status(400).json({ error: e });
	}
  });
  
  userRouter.post("/api/event/return", async (req: any, res: any) => {
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
  