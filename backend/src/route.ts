import express from 'express';
import { connect } from 'http2';
const passport = require('passport');
import authCheck from './middleware/auth';

export const router = express.Router();

router.get('/auth/login', passport.authenticate('42'));
router.post('/', authCheck, function(req:any, res:any, next){
    console.log('user', req.user);
    res.json({ test: req.user });
});
router.post('/lent', function(req:any, res:any){
    console.log(req);
    res.json({cabinet_id: req.cabinet_id});
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
