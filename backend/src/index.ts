import express from 'express'
import path from 'path';
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
import cors from 'cors'
import {connection} from './db/db_dep'
import {router} from './route'

function makeServer(){
    const app = express();
    const port = 4242;

    const swaggerSpec = YAML.load(path.join(__dirname, '../api/swagger.yaml'));

    app.use(
        cors({
            origin: "http://localhost:3000",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true,
        })
    );
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    app.use('/', router);
    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/', function(req, res){
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.listen(port, ()=>console.log(`Listening on port ${port}`));
    // connection();
}
