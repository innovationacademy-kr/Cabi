import express from "express";
import passport from "passport";
import { checkUser } from "../../models/queryModel";

export const authRouter = express.Router();

authRouter.get("/auth/login", passport.authenticate("42")); // intra 로그인

authRouter.get(
  "/auth/login/callback", // intra 로그인 시도 후 처리
  passport.authenticate("42", {
    failureMessage: "LOGIN FAILED :(",
    failureRedirect: "/",
  }),
  async (req: any, res: any) => {
    try {
      // console.log(res, req.session.passport.user);
      verifyLent(res, req.session.passport.user);
    } catch (err) {
      //console.log(err);
      //res.status(400).json({ error: err });
      res.status(400).json({ error: err }).redirect("/");
    }
  }
);
authRouter.post("/auth/logout", (req: any, res: any) => {
  try {
    req.logout();
    res.clearCookie("accessToken");
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});
export const verifyLent =async (res: any, decoded: any) => {
  try {
    const lentCabinet: any = await checkUser(decoded);
    if (lentCabinet.lent_id !== -1) {
      return res.redirect("/return");
    } else {
      return res.redirect("/lent");
    }
  } catch (err: any) {
    console.error('verifyLent - ', err);
    res.status(400).redirect("/");
  }
}
