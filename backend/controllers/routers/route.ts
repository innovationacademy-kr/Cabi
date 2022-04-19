import passport from "passport";
import authCheck from "../middleware/auth";
import { userList, userInfo, lentCabinetInfo } from "../../models/user";
import { checkUser } from "../../models/query";
import { userRouter } from "./user";

export const router = userRouter;

router.get("/auth/login", passport.authenticate("42")); // intra 로그인
router.post("/", authCheck, (req: any, res: any) => {
  res.json({ test: req.user });
});
router.get(
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
      //res.status(400).json({ error: err });
      res.status(400).json({ error: err }).redirect("/");
    }
  }
);
router.post("/auth/logout", (req: any, res: any) => {
  const idx = userList.findIndex(
    (user: userInfo) => user.access === req.session.passport.user.access
  );
  if (idx !== -1) {
    userList.splice(idx, 1);
  } else {
    res.status(400).send({ error: "Permission Denied" });
    return;
  }
  req.logout();
  req.session = null;
  res.send({ result: "success" });
});
