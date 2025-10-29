import dotenv from 'dotenv'
dotenv.config()
import User from '../models/userModel.js'
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'

passport.use(
    new GoogleStrategy(
        {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done)=>{
        console.log('Google Profile:', profile)
        try{
            let user = await User.findOne({googleId: profile.id})
            if(user){
                console.log('User found:', user)
                done(null, user)
            }else{
                user = await User.findOne({email: profile.emails[0].value})
                if(user){
                    user.googleId = profile.id
                    await user.save()
                    console.log('Existing user linked:', user)
                    done(null, user)
                }else{
                    const newUser = await User.create({
                        googleId: profile.id,
                        fullName: profile.displayName,
                        email: profile.emails[0].value
                    })
                    console.log('New user created:', newUser)
                    done(null, newUser)
                }
            }
        }catch(e){
            console.error('Error in google strategy:',e.stack)
            done(e, null)
        }
    }
)
)