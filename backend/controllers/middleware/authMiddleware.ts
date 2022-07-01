import { checkBannedUserList } from "../../models/queryModel";
import { userInfo } from "../../models/types";
import { verifyLent } from "../routers/authRouter";
import { jwtToken, verifyToken } from "./jwtMiddleware";

export async function loginBanCheck(req: any, res: any, next: any) {
  try {
    // if (!req.session || !req.session.passport || !req.session.passport.user) {
    //   res.status(400).send({ error: "Permission Denied" });
    //   return;
    // }
    const idx = verifyToken(req, res);
    if (idx === undefined) {
      res.status(400).send({ error: "Permission Denied" });
      return;
    }
    const isBanned = await checkBannedUserList(req.session.passport.user.user_id);
    if (isBanned === 1) {
      res.status(400).send({ error: "Permission Denied" });
      return;
    };
  } catch(err) {
    console.log(err);
    throw(err);
  };

  next();
}

export default async function authCheck(req: any, res: any, next: any) {
  if (!req.cookies || !req.cookies.accessToken) {
    next();
  } else {
    const result = await jwtToken.verify(req.cookies.accessToken) as userInfo;
    if (typeof result === "number" || typeof result === "undefined" || typeof result === "string") {
      next();
    } else {
      verifyLent(res, result);
    }
  }
}


