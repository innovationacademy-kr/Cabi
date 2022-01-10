import express from 'express'
import path from 'path'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

import {connection} from './db/db_dep'
import {router} from './route'

import passport from 'passport'
import passportConfig from './middleware/passport';
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";

import {locationInfo} from './db/query'

function makeServer(){
    const app = express();
    const port = process.env.PORT || 4242;

    const swaggerSpec = YAML.load(path.join(__dirname, '../api/swagger.yaml'));
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    
    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/', function(req, res){
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    app.listen(port, ()=>console.log(`Listening on port ${port}`));

    app.use(
        cookieSession({
            maxAge: 60 * 60 * 1000,
            keys: [process.env.COOKIE_KEY || 'secret'],
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    app.use(passport.initialize());
    app.use(passport.session());
    passportConfig();

    app.use('/', router);
    connection(locationInfo);
}
makeServer();
