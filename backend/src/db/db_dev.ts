const mysqlssh = require('mysql-ssh')
import fs from 'fs';
import {getUser, addUser, checkUser, postReturn, postLent, getLentUser, locationInfo} from './query'

let cabinet_list:Array<string>;
export function connection(){
    console.log('start!');
    mysqlssh.connect({
        host: 'cabi.42cadet.kr',
        user: 'ec2-user',
        privateKey: fs.readFileSync('./src/key/swlabs-cadet.pem')
    },{
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: '42cabi_DB',
        dateStrings: 'date'
    }).then((client:any)=>{
        console.log('connection!!');
        // getUser(client);
        // addUser(client);
        // checkUser(client);
        // postReturn(client);
        // postLent(client);
        // getLentUser(client);
        getLentUser(client);
        locationInfo(client);
    }).catch((err:any)=>{
        console.log(err);
        throw err;
    });
}

