import express from "express";
import passport from "passport";
import { checkUser } from "../../models/queryModel";
import { userInfo } from "../../models/types";
import authCheck from "../middleware/authMiddleware";

export const authRouter = express.Router();

authRouter.get("/auth/login", authCheck, passport.authenticate("42")); // intra 로그인

authRouter.get(
  "/auth/login/callback", // intra 로그인 시도 후 처리
  passport.authenticate("42", {
    failureMessage: "LOGIN FAILED :(",
    failureRedirect: "/",
  }),
  (req: any, res: any) => {
    //only after 42login
    verifyLent(res, req.session.passport.user);
  }
);

authRouter.post("/auth/logout", async (req: any, res: any) => {
  try {
    req.logout();
    res.clearCookie("accessToken");
    res.redirect("/");
  } catch (err: any) {
    const error = new Error(err.message)
    error.name = 'LogoutError';
    console.error(error);
  }
});

//verify whether the user lent cabinet or not
export const verifyLent = async (res: any, decoded: userInfo) => {
  const lentCabinet = await checkUser(decoded);
  if (lentCabinet.lent_id !== -1) {
    return res.redirect("/return");
  }
  return res.redirect("/lent");
}
