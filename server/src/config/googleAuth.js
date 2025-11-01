import User from "../models/userModel.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
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
          console.log("User found by googleId:", user);
          return done(null, user);
        }

        // Check if user exists with this email
        user = await User.findOne({ email });
        if (user) {
          // Check if this is a password-based account (no googleId)
          if (!user.googleId && user.password) {
            // User registered with email/password, don't auto-link
            console.log("User exists with password-based account");
            return done(new Error("An account with this email already exists. Please sign in with your email and password."), null);
          }

          // If user has googleId but we didn't find them above, link the account
          if (user.googleId) {
            console.log("User found by email with googleId:", user);
            return done(null, user);
          }
        }

        // Create new user
        // Generate username from email or googleId
        let username = email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') : `user${googleId}`;

        // Ensure username is unique by checking database
        let usernameExists = await User.findOne({ username });
        let counter = 1;
        while (usernameExists) {
          username = email ? `${email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')}${counter}` : `user${googleId}${counter}`;
          usernameExists = await User.findOne({ username });
          counter++;
        }

        const newUser = await User.create({
          googleId,
          fullName: profile.displayName,
          email,
          username,
          profileImage: photo,
        });
        console.log("New user created:", newUser);
        done(null, newUser);
      } catch (e) {
        console.error("Error in google strategy:", e.stack);
        done(e, null);
      }
    }
  )
);
