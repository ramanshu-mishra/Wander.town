import passport from "passport"
import local from "passport-local"
import google from "passport-google-oauth20";
const googleStrategy = google.Strategy;
const LocalStrategy = local.Strategy;
// @ts-ignore
import { PrismaClient } from "@repo/database/prisma";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const customFields: { usernameField: string; passwordField: string } = {
    usernameField: "username",
    passwordField: "password"
};

const verifyCallBack = async (username: string, password: string, done: (error: any, user?: any) => void) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if (!user) {
            return done(null, false);
        }
        if(!user.password){
            return done(null, false);
        }
        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
            return done(null, false);
        } else {
            return done(null, user);
        }
    } catch (e) {
        return done(e, false);
    }
};

const strategy = new LocalStrategy(customFields, verifyCallBack);

passport.use(strategy);


passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
 async function(accessToken:any, refreshToken:any, profile:any, cb:any) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    // prisma.user.create({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    let usr = await prisma.user.findUnique({ where: { id: profile.id } });

    // if(usr){
    //     const session = await prisma.session.findUnique({
    //         where: {
    //             sid: 
    //         }
    //     })
    // }

    if(!usr){
        let t = 10;
        while(t--){
            try{
            usr = await prisma.user.create({
            data: {
                id: profile.id,
                username: profile.name.givenName.split(" ")[0]+profile.name.familyName.split(" ")[0]+ Math.random()*10,
                name: profile.name.givenName ,
            }
        })
        break;
    }
    catch{
        continue;
    }
        }
        
        if(usr){
            return cb(null, usr);
        }
        else{
            return cb(new Error("authentication failed"))
        }
    }
    else{
       return cb(null, usr);
    }
  }
));






interface userInterface{
    id:string
}
passport.serializeUser((user,done)=>{
    // @ts-ignore
    done(null,user.id);

});

passport.deserializeUser(async(userId,done)=>{
    const user = await prisma.user.findFirst({
        where: {
            id: userId as string
        }
    })
    if(!user){
        done(new Error("user not found"))
    }
    else{
        done(null, user);
    }
})




