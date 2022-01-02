const mysqlssh = require('mysql-ssh')
import fs from 'fs';
import {getUser} from './query'

export function connection(){
    console.log('start!');
    mysqlssh.connect({
        host: 'cabi.42cadet.kr',
        user: 'ec2-user',
        privateKey: fs.readFileSync('../key/swlabs-cadet.pem')
    },{
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: '42cabi_DB'
    }).then((client:any)=>{
        console.log('connection!!');
        getUser(client);
    }).catch((err:any)=>{
        console.log(err);
        throw err;
    });
}

