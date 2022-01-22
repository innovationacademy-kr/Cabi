import cors from 'cors'
import path from 'path'
import YAML from 'yamljs'
import express from 'express'
import passport from 'passport'
import swaggerUI from 'swagger-ui-express'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'

import { router } from './route'
import { connectionForCabinet } from './db/db'
import passportConfig from './middleware/passport'

import dotenv from 'dotenv'
// dotenv.config({path:'/home/ec2-user/git/42cabi/backend/.env'}); //dep
// dotenv.config({path:'/home/ec2-user/git/42cabi-dev/backend/.env'}); //dev
dotenv.config(); //local

function makeServer() {
    const app = express();
    const port = process.env.PORT || 4242;

    if (port === '4242') {
        app.use(
            cors({
                origin: 'http://localhost:3000',
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                credentials: true,
            })
        );
    }

    const swaggerSpec = YAML.load(path.join(__dirname, '../api/swagger.yaml'));
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    if (port === '2424') {
        app.use(express.static(path.join(__dirname, '../public')));
    }

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

    if (port === '2424') {
        app.use('/', function (req, res) {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });
    }

    app.listen(port, () => console.log(`Listening on port ${port}`));
}
makeServer();