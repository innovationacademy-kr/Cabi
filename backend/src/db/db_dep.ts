import mariadb from 'mariadb';
import {getUser} from './query'

const con = mariadb.createPool({
	host: 'localhost',
	user: 'root'
});

export async function connection() {
    let pool, row;
    // console.log("trying...");
    try{
        pool = await con.getConnection()
        getUser(pool);
    }catch(err){
        throw err;
    }finally{
        if (pool) pool.end();
        return ;
    }
}
