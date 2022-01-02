const mysqlssh = require('mysql-ssh')
import fs from 'fs';
import {getUserList} from './query'

export function connection(){
    console.log('start!');
    mysqlssh.connect({
        host: 'cabi.42cadet.kr',
        user: 'ec2-user',
        privateKey: fs.readFileSync('/Users/yoonhyeonji/Desktop/42Seoul/42cabi/swlabs-cadet.pem')
    },{
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: '42cabi_DB'
    }).then((client:any)=>{
        console.log('connection!!');
        getUserList(client);
    }).catch((err:any)=>{
        console.log(err);
        throw err;
    });
}

