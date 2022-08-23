import path from "path";
import YAML from "yamljs";
import express from "express";
import passport from "passport";
import swaggerUI from "swagger-ui-express";
import cookieParser from "cookie-parser";
import expressSession from "express-session";

import { apiRouter } from "./controllers/routers/apiRouter";
import { authRouter } from "./controllers/routers/authRouter";
import { eventRouter } from "./controllers/routers/eventRouter";

import passportConfig from "./controllers/middleware/passportMiddleware";
import slack from "./controllers/middleware/slackMiddleware";
import scheduling from "./controllers/middleware/emailerMiddleware";

import dotenv from "dotenv";

const env = process.env;
if (env.USER === "ec2-user") {
  dotenv.config({ path: env.PWD + "/.env" }); //dep
} else {
  dotenv.config(); //local
}

const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

export const app = express();

Sentry.init({
  dsn: "https://8d771150bd1e4339baf68d827c0c11b3@o1124326.ingest.sentry.io/6162624",
  tracingOptions: {
    // 하위 구성 요소를 추적하고 렌더링 프로세스에 대한 자세한 내용을 보기
    trackComponents: true,
  },
  attachProps: true, // 로깅을 위해 모든 Vue 구성 요소의 props를 보기
  tracesSampleRate: 1, // 0에서 1 사이의 숫자로 주어진 트랜잭션이 Sentry로 전송 될 확률을 제어
  // beforeSend: (event:any, hint:any) => this._sendErrorMessage(event, hint) // 에러를 Sentry에게 전달하기 전 처리할 수 있는 hook
});

const swaggerSpec = YAML.load(path.join(__dirname, "./api/swagger.yaml"));
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(express.static(path.join(__dirname, "./views")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: "key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.use("/api/event", eventRouter);
app.use("/api", apiRouter);
app.use("/", authRouter);
slack();
// scheduling();
// connectionForCabinet();

app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./views/index.html"));
});
