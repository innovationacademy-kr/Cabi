import passport from 'passport'
import {userList} from '../../models/user'

import dotenv from 'dotenv'

const env = process.env;
if (process.env.USER === 'ec2-user'){
	//if (env.PORT === '4242')
        dotenv.config({path:'/home/ec2-user/git/42cabi/backend/.env'}); //dep
  //  else
    //    dotenv.config({path:'/home/ec2-user/git/42cabi-dev/backend/.env'}); //dev
}
else
	dotenv.config(); //local


const Strategy = require('passport-42')

passport.serializeUser(function(user:any, done:any){
    return done(null, user);
});
passport.deserializeUser(function(user:any, done:any){
    return done(null, user);
});

const FortyTwoOpt = {
    clientID: env.FORTYTWO_APP_ID,
    clientSecret: env.FORTYTWO_APP_SECRET,
    callbackURL: env.CALLBACK_URL,
    passReqToCallback: true,
};

const FortyTwoVerify = (req:any, accessToken:any, refreshToken:any, profile:any, cb:any)=>{
    const userInfo = {
        user_id: profile.id,
        intra_id: profile.username,
        email: profile.emails[0].value,
        access: accessToken,
        refresh: refreshToken,
    };
    const idx = userList.findIndex((user)=>user.user_id === profile.id)
    if (idx !== -1){
        userList.splice(idx, 1);
    }
    userList.push({
        user_id: profile.id,
        intra_id: profile.username,
        email: profile.emails[0].value,
        auth: false,
        access: accessToken,
        refresh: refreshToken,
        phone: ""
    });
    return cb(null, userInfo);
};

export default function passportUse(){
    passport.use(new Strategy(FortyTwoOpt, FortyTwoVerify));
};
