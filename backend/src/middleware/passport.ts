import dotenv from 'dotenv'
dotenv.config({path:'./.env.local'});
// dotenv.config({path:'/home/ec2-user/git/42cabi-dev/backend/.env'});
import passport from 'passport'
import {user} from '../user'

const Strategy = require('passport-42')
const env = process.env;

passport.serializeUser(function(user:any, done:any){
    console.log('Serialize User', user);
    return done(null, user);
});
passport.deserializeUser(function(user:any, done:any){
    console.log("deserializeUser!");
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
        username: profile.username,
        displayname: profile.displayName,
        email: profile.emails[0].value,
        userid: profile.id,
        access: accessToken,
        refresh: refreshToken,
    };
    // console.log(user);
    // console.log(profile);
    console.log(`accessToken : ${accessToken}`);
    console.log(`refreshToken: ${refreshToken}`);
    user.user_id = profile.id;
    user.intra_id = profile.displayName;
    user.email = profile.emails[0].value;
    user.access = accessToken;
    user.refresh = refreshToken;
    return cb(null, userInfo);
}

export default function passportUse(){
    passport.use(new Strategy(FortyTwoOpt, FortyTwoVerify));
}
