import { checkBannedUserList, checkUser } from "../../models/queryModel";
import { userInfo } from "../../models/types";
import { jwtToken, verifyToken } from "./jwtMiddleware";

//authorization for api request
export async function loginBanCheck(req: any, res: any, next: any) {
  try {
    const user = await verifyToken(req.cookies.accessToken, res);
    if (user) {
      const isBanned = await checkBannedUserList(user.user_id);
      if (isBanned === 1) {
        res.status(400).send({ error: "Permission Denied" });
        return;
      };
      return next();
    }
  } catch(err: any) {
    const error = new Error(err.message)
    error.name = 'LoginBanCheckError';
    console.error(error);
    res.status(400).send({ error : error });
  };
}

//authorization before 42login
export default async function authCheck(req: any, res: any, next: any) {
  try {
    if (!req.cookies || !req.cookies.accessToken) {
      return next();
    }
    const decoded = await jwtToken.verify(req.cookies.accessToken) as userInfo;
    if (typeof decoded === "number") {
      return next();
    }
    const lentCabinet = await checkUser(decoded);
    if (lentCabinet.lent_id !== -1) {
      return res.redirect("/return");
    }
    return res.redirect("/lent");
  } catch (err: any) {
    const error = new Error(err.message)
    error.name = 'AuthCheckError';
    console.error(error);
    next();
  }
}
