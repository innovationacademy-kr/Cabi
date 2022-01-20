import dotenv from 'dotenv'
dotenv.config();
// dotenv.config({path:'./.env.local'});
// dotenv.config({path:'/home/ec2-user/git/42cabi-dev/backend/.env'});
import passport from 'passport'
import {userList} from '../user'

const Strategy = require('passport-42')
const env = process.env;

passport.serializeUser(function(user:any, done:any){
    console.log('Serialize User', user);
    return done(null, user);
});
passport.deserializeUser(function(user:any, done:any){
    done(null, user);
});

const FortyTwoOpt = {
    clientID: env.FORTYTWO_APP_ID,
    clientSecret: env.FORTYTWO_APP_SECRET,
    callbackURL: env.CALLBACK_URL,
    passReqToCallback: true,
};

const FortyTwoVerify = (req:any, accessToken:any, refreshToken:any, profile:any, cb:any) =>{
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
}

export default function passportUse(){
    passport.use(new Strategy(FortyTwoOpt, FortyTwoVerify));
}
