import express from 'express';
import passport from 'passport';
import authCheck from './middleware/auth';
import {cabinetList, cabinetLent, lent} from './user'
import {checkUser, createLentLog, createLent, getLentUser } from './db/query'
import {connection, connectionForLent} from './db/db_dep'

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
        // successRedirect: "https://cabi.42cadet.kr/lent",
        failureMessage: "LOGIN FAILED :(",
        failureRedirect: "http://cabi.42cadet.kr/",
    }),
    function(req:any, res:any){
        //lent 있는 경우, 순서 확인
	console.log('callback function!');
        try{
	    console.log('check_user');
            connection(checkUser);
            if (lent.lent_id !== -1){
                res.redirect('http://cabi.42cadet.kr/return');            
            }else{
                res.redirect('http://cabi.42cadet.kr/lent');
            }
        }catch(err){
            console.log(err);
        }
    }
);

router.post("/api/cabinet", (req:any, res:any, next:any)=>{
    if (!cabinetList)
        res.status(400).json({error: "no user"});
    else
        res.send(cabinetList);
})
router.post("/api/lent_info", async (req:any, res:any)=>{
    try{
        await connection(getLentUser);
        console.log(cabinetLent);
        res.send(cabinetLent);
    }catch(err:any){
        console.log(err);
        res.status(400).json({error: "no cabinet"});
        throw err;
    };
})
router.post('/api/lent', function(req:any, res:any){
    try{
        connectionForLent(createLent, req.body.cabinet_id);
        res.send({cabinet_id: req.cabinet_id});
    }catch(err){
        console.log(err);
        res.status(400).send({cabinet_id: req.cabinet_id});
    }
})
router.post("/api/return", (req:any, res:any)=>{
    try{
        connection(createLentLog);
    }catch(err){
        console.log(err);
        res.status(400).json({error: err});
    }
})
