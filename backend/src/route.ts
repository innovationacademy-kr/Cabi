import express from 'express';
import passport from 'passport';
import authCheck from './middleware/auth';
import {cabinetList, cabinetLent, lent, user} from './user'
import {checkUser, createLentLog, createLent, getCabinetInfo} from './db/query'
import {connection, connectionForLent} from './db/db_dev'

export const router = express.Router();

router.get('/auth/login', passport.authenticate('42'));
router.post('/', authCheck, function(req:any, res:any, next){
    // console.log(req.user);
    res.json({ test: req.user });
});

router.post('/lent', function(req:any, res:any){
    try{
        connectionForLent(createLent, req.body.cabinet_id);
        res.send({cabinet_id: req.cabinet_id});
    }catch(err){
        console.log(err);
        res.status(400).send({cabinet_id: req.cabinet_id});
    }
});

router.get(
    "/auth/login/callback",
    passport.authenticate("42", {
        // successMessage: "LOGIN SUCCESS!",
        // successRedirect: "/lent",
        failureMessage: "LOGIN FAILED :(",
        failureRedirect: "/",
    }),
    function(req:any, res:any){
        //lent 있는 경우, 순서 확인
        try{
            connection(checkUser);
            if (lent.lent_id !== -1){
                res.redirect('/return');            
            }else{
                res.redirect('/lent');
            }
        }catch(err){
            console.log(err);
        }
    }
);
router.get('/auth/logout', function(req:any, res:any){
    user.user_id = 0,
    user.intra_id = '',
    user.email = '',
    user.access = '',
    user.refresh = ''
    res.redirect('/');
});

router.post("/api/cabinet", (req:any, res:any, next:any)=>{
    if (!cabinetList)
        res.status(400).json({error: "no user"});
    else
        res.send(cabinetList);
})
router.post("/api/lent_info", (req:any, res:any)=>{
    if (!cabinetLent)
        res.status(400).json({error: "no cabinet"});
    else
        res.send(cabinetLent);
})
router.post("/api/return", (req:any, res:any)=>{
    try{
        connection(createLentLog);
    }catch(err){
        console.log(err);
        res.status(400).json({error: err});
    }
})
