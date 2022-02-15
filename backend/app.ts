import path from 'path'
import YAML from 'yamljs'
import express from 'express'
import passport from 'passport'
import swaggerUI from 'swagger-ui-express'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'

import { router } from './controllers/routers/route'
import { connectionForCabinet } from './models/db'
import passportConfig from './controllers/middleware/passport'

import dotenv from 'dotenv'
// dotenv.config({path:'/home/ec2-user/git/42cabi/backend/.env'}); //dep
if (process.env.USER === 'ec2-user')
    dotenv.config({path:'/home/ec2-user/git/42cabi-dev/backend/.env'}); //dev
else
    dotenv.config(); //local

const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

export const app = express();

Sentry.init({
    dsn: "https://8d771150bd1e4339baf68d827c0c11b3@o1124326.ingest.sentry.io/6162624",
    tracingOptions: { // 하위 구성 요소를 추적하고 렌더링 프로세스에 대한 자세한 내용을 보기
       trackComponents: true,
    },
    attachProps: true, // 로깅을 위해 모든 Vue 구성 요소의 props를 보기
    tracesSampleRate: 1, // 0에서 1 사이의 숫자로 주어진 트랜잭션이 Sentry로 전송 될 확률을 제어
    // beforeSend: (event:any, hint:any) => this._sendErrorMessage(event, hint) // 에러를 Sentry에게 전달하기 전 처리할 수 있는 hook
 });

const swaggerSpec = YAML.load(path.join(__dirname, './api/swagger.yaml'));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(express.static(path.join(__dirname, './views')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'key',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.use('/', router);

connectionForCabinet();

app.use('/', function (req, res) {
    res.sendFile(path.join(__dirname, './views/index.html'));
});
