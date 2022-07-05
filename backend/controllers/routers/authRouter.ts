import express from "express";
import passport from "passport";
import { checkUser } from "../../models/queryModel";
import { lentCabinetInfo, userInfo, userList } from "../../models/types";

export const authRouter = express.Router();

authRouter.get("/auth/login", passport.authenticate("42")); // intra 로그인

authRouter.get(
  "/auth/login/callback", // intra 로그인 시도 후 처리
  passport.authenticate("42", {
    failureMessage: "LOGIN FAILED :(",
    failureRedirect: "/",
  }),
  async (req: any, res: any) => {
    const idx = userList.findIndex(
      (user: userInfo) => user.access === req.session.passport.user.access
    );

    if (idx === -1) {
      res.status(400).send({ error: "Permission Denied" });
      return;
    }
    try {
      await checkUser(req.session.passport.user).then(
        (resp: lentCabinetInfo) => {
          if (!resp) {
            res.status(400).send({ error: "Permission Denied" });
            return;
          }
          if (resp.lent_id !== -1) {
            // lent_id가 -1이 아니라면 -> 빌린 사물함이 있음
            res.redirect("/return"); // /return으로 이동
          } else {
            res.redirect("/lent"); // lent_id === -1 -> 빌린 사물함이 없음 -> /lent로 이동
          }
        }
      );
    } catch (err) {
      //console.log(err);
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
