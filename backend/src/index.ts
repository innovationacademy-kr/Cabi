import express from 'express'
import path from 'path';
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
import {getUserList} from './app'

function makeServer(){
    const app = express();
    const port = 4242;

    const swaggerSpec = YAML.load(path.join(__dirname, '../api/swagger.yaml'));
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    app.listen(port, ()=>console.log(`Listening on port ${port}`));
    
    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/', function(req, res){
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    getUserList();
}



makeServer();
