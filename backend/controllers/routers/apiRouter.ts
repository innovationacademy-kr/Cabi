import express from "express";
import { lentInfo } from "../../models/types";
import {
  createLentLog,
  createLent,
  getLentUser,
  getUser,
  activateExtension,
  checkCabinetStatus,
} from "../../models/queryModel";
import { loginBanCheck } from "../middleware/authMiddleware";
import { verifyToken } from "../middleware/jwtMiddleware";
import { connectionForCabinet } from "../../models/dbModel";

export const apiRouter = express.Router();

// 전체 사물함에 대한 정보
apiRouter.post("/cabinet", async (req: any, res: any) => {
  const cabinet = await connectionForCabinet();
  if (cabinet.location?.length === 0) {
    res.status(400).send({ error: "no cabinet information" });
  } else {
    res.send(cabinet);
  }
});

// 현재 모든 대여자들의 정보
apiRouter.post("/lent_info", loginBanCheck, async (req: any, res: any) => {
  try {
    const lent = await getLentUser();
    const user = await verifyToken(req.cookies.accessToken, res);

		if (user) {
      const isLent = lent.lentInfo.findIndex((cabinet: lentInfo) => cabinet.lent_user_id === user.user_id);
      res.send({
        lentInfo: lent.lentInfo,
        isLent: isLent
      });
    }
  } catch (err: any) {
    // console.error(err);
    res.sendStatus(400);
  }
});

// 특정 사물함을 빌릴 때 요청
apiRouter.post("/lent", loginBanCheck, async (req: any, res: any) => {
  let errno: number;
  try {
    const user = await verifyToken(req.cookies.accessToken, res);
    const cabinetStatus = await checkCabinetStatus(req.body.cabinet_id);
    if (user && cabinetStatus) {
      const myLent = await getUser(user);
      if (myLent.lent_id === -1) {
        const response = await createLent(req.body.cabinet_id, user);
        errno = response && response.errno === -1 ? -2 : req.body.cabinet_id;
        res.send({ cabinet_id: errno });
      } else {
        res.send({ cabinet_id: -1 });
      }
    } else {
      res.status(400).send({ cabinet_id: req.cabinet_id })
    }
  } catch (err) {
    // console.error(err);
    res.status(400).json({ cabinet_id: req.cabinet_id });
  }
});

// 특정 사용자가 현재 대여하고 있는 사물함의 정보
apiRouter.post("/return_info", loginBanCheck, async (req: any, res: any) => {
  try {
    const user = await verifyToken(req.cookies.accessToken, res);
    if (user) {
      const result = await getUser(user);
      res.send(result);
    }
  } catch (err: any) {
    // console.error(err);
    res.sendStatus(400);
  }
});

// 특정 사물함을 반납할 때 요청
apiRouter.post("/return", loginBanCheck, async (req: any, res: any) => {
  try {
    const user = await verifyToken(req.cookies.accessToken, res);
    if (user) {
      createLentLog({
        user_id: user.user_id,
        intra_id: user.intra_id,
      }).then((resp: any) => {
        res.sendStatus(200);
      });
    }
  } catch (err: any) {
    // console.error(err);
    res.sendStatus(400);
  }
});

// 적절한 유저가 페이지를 접근하는지에 대한 정보
apiRouter.post("/check", loginBanCheck, async (req: any, res: any) => {
  try {
    const user = await verifyToken(req.cookies.accessToken, res);
    if (user) {
      res.send({ user: user });
      return ;
    }
  } catch (err: any) {
    // console.error(err)
    res.sendStatus(400);
  }
});

apiRouter.post("/extension", loginBanCheck, async (req: any, res: any) => {
  try {
    const user = await verifyToken(req.cookies.accessToken, res);
    if (user) {
      await activateExtension(user);
      res.sendStatus(200);
    }
  } catch (err) {
    // console.error(err);
    res.sendStatus(400);
  }
});
