import dotenv from "dotenv";
dotenv.config();
import User from "../models/userModel.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile);
      try {
        const googleId = profile && profile.id;
        const emails = profile && profile.emails;
        const email = Array.isArray(emails) ? emails[0]?.value : undefined;
        const photo = Array.isArray(profile?.photos)
          ? profile.photos[0]?.value
          : undefined;
        if (!googleId)
          return done(new Error("No profile id from google"), null);

        let user = await User.findOne({ googleId });
        if (user) {
          console.log("User found:", user);
          done(null, user);
        } else {
          user = await User.findOne({ email });
          if (user) {
            user.googleId = googleId;
            user.profileImage = photo || user.profileImage;
            await user.save();
            console.log("Existing user linked:", user);
            done(null, user);
          } else {
            const newUser = await User.create({
              googleId,
              fullName: profile.displayName,
              email,
              profileImage: photo,
            });
            console.log("New user created:", newUser);
            done(null, newUser);
          }
        }
      } catch (e) {
        console.error("Error in google strategy:", e.stack);
        done(e, null);
      }
    }
  )
);
