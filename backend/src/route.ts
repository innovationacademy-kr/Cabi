import express from 'express';
import passport from 'passport';
import authCheck from './middleware/auth';
import {cabinetList, cabinetLent, lent, user, userList, lentCabinet} from './user'
import {checkUser, createLentLog, createLent, getLentUser, getUser} from './db/query'
import {connection, connectionForLent} from './db/db_dev'

export const router = express.Router();

router.get('/auth/login', passport.authenticate('42'));
router.post('/', authCheck, function(req:any, res:any){
    // console.log(req.user);
    res.json({ test: req.user });
});

router.get(
    "/auth/login/callback",
    passport.authenticate("42", {
        // successMessage: "LOGIN SUCCESS!",
        // successRedirect: "/lent",
        failureMessage: "LOGIN FAILED :(",
        failureRedirect: "http://localhost:3000",
    }),
    function(req:any, res:any){
        //lent 있는 경우, 순서 확인
        try{
            // console.log(req.cookies);
            // console.log(req.session.passport.user);
            connection(checkUser);
            if (lent.lent_id !== -1){
                res.redirect('http://localhost:3000/return');
            }else{
                res.redirect('http://localhost:3000/lent');
            }
        }catch(err){
            console.log(err);
        }
    }
);
router.post('/auth/logout', (req:any, res:any)=>{
    // user.user_id = 0,
    // user.intra_id = '',
    // user.email = '',
    // user.access = '',
    // user.refresh = ''
    // const idx = userList.findIndex((user)=>user.access === res.cookies('access'))
    // if (idx !== -1){
    //     userList.splice(idx, 1);
    // }

    req.logout();
    req.session.save();
    req.session.destroy((err:any)=>{
        if (err) throw err;
    });
    // console.log(req.session);
    // console.log(req.cookies);

    res.send({result: 'success'});
});

router.post("/api/cabinet", (req:any, res:any)=>{
    if (!cabinetList)
        res.status(400).json({error: "no user"});
    else
        res.send(cabinetList);
})
router.post("/api/lent_info", async (req:any, res:any)=>{
    // console.log(cabinetLent);
    try{
        await connection(getLentUser);
        // console.log(cabinetLent);
        res.send(cabinetLent);
    }catch(err:any){
        console.log(err);
        res.status(400).json({error: "no cabinet"});
        throw err;
    };
})
router.post('/api/lent', (req:any, res:any)=>{
    console.log(req.body);
    try{
        connectionForLent(createLent, req.body.cabinet_id);
        res.send({cabinet_id: req.cabinet_id});
    }catch(err){
        console.log(err);
        res.status(400).send({cabinet_id: req.cabinet_id});
    }
})

router.post("/api/return_info", async (req:any, res:any)=>{
	user.user_id = req.body.user_id;
	connection(getUser).then(()=> {
		console.log(lentCabinet);
		res.send({lentCabinet : lentCabinet});
	});
})

router.post("/api/return", (req:any, res:any)=>{
    lentCabinet.lent_id = req.body.lent_id;
    try{
        connection(createLentLog);
        res.send();
    }catch(err){
        console.log(err);
        res.status(400).json({error: err});
    }
})

router.post("/api/check", (req:any, res:any)=>{
    console.log(req.session);
    
    // if (!req.session || !req.session.passport || !req.session.passport.user){
    //     console.log('fail');
    //     res.status(400).send({result: 'failed'});
    // }else{
        console.log('success');
        res.send({result: 'success'});
    // }
});