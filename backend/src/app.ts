import mariadb from 'mariadb';
const con = mariadb.createPool({
	host: 'localhost',
	user: 'root'
});

export async function getUserList() {
    let pool, row;
    console.log("trying...");
    try{
        pool = await con.getConnection();
        pool.query('USE 42cabi_DB');
        row = await pool.query('SELECT * FROM user');
    }catch(err){
        throw err;
    }finally{
        if (pool) pool.end();
        return row[0];
    }
}