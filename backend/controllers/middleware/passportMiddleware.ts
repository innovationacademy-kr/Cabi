import passport from "passport";

import dotenv from "dotenv";
import { userList } from "../../models/types";

const env = process.env;
if (env.USER === "ec2-user") {
  dotenv.config({ path: env.PWD + "/.env" }); //dep
} else {
  dotenv.config(); //local
}

const Strategy = require("passport-42");

passport.serializeUser(function (user: any, done: any) {
  return done(null, user);
});
passport.deserializeUser(function (user: any, done: any) {
  return done(null, user);
});

const FortyTwoOpt = {
  clientID: env.FORTYTWO_APP_ID,
  clientSecret: env.FORTYTWO_APP_SECRET,
  callbackURL: env.CALLBACK_URL,
  passReqToCallback: true,
};

const FortyTwoVerify = async (
  req: any,
  accessToken: any,
  refreshToken: any,
  profile: any,
  cb: any
) => {
  const userInfo = {
    user_id: profile.id,
    intra_id: profile.username,
    email: profile.emails[0].value,
    access: accessToken,
    refresh: refreshToken,
  };
  const idx = userList.findIndex((user) => user.user_id === profile.id);
  if (idx !== -1) {
    userList.splice(idx, 1);
  }
  userList.push({
    user_id: profile.id,
    intra_id: profile.username,
    email: profile.emails[0].value,
    auth: 0,
    access: accessToken,
    refresh: refreshToken,
    phone: "",
  });
  return cb(null, userInfo);
};

export default function passportUse() {
  passport.use(new Strategy(FortyTwoOpt, FortyTwoVerify));
}
