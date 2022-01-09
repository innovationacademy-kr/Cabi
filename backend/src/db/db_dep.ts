import mariadb from 'mariadb';

const con = mariadb.createPool({
	host: 'localhost',
	user: 'root'
});

export async function connection(queryFunction:any) {
    let pool;
    try{
        pool = await con.getConnection()
        queryFunction(pool);
    }catch(err){
        throw err;
    }finally{
        if (pool) pool.end();
        return ;
    }
}

export async function connectionForLent(queryFunction:any, cabinet_id:number) {
    let pool;
    try{
        pool = await con.getConnection()
        queryFunction(pool, cabinet_id);
    }catch(err){
        throw err;
    }finally{
        if (pool) pool.end();
        return ;
    }
}