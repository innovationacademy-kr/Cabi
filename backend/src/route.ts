import express from 'express';
const passport = require('passport');
import authCheck from './middleware/auth';
import {cabinetList, cabinetLent} from './user'

export const router = express.Router();

router.get('/auth/login', passport.authenticate('42'));
router.post('/', authCheck, function(req:any, res:any, next){
    console.log('user', req.user);
    res.json({ test: req.user });
});
router.get(
    "/auth/login/callback",
    passport.authenticate("42", {
        successMessage: "LOGIN SUCCESS!",
        successRedirect: "http://localhost:3000/lent",
        failureMessage: "LOGIN FAILED :(",
        failureRedirect: "http://localhost:3000",
    }),
    // function(req, res){
    //     res.cookie('accessToken', "hi", { maxAge: 300000 });
    //     // res.redirect('http://localhost:3000/twofactor');
    //     res.redirect('http://localhost:3000/game/lobby');
    // }
);
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
