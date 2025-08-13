// import dotenv from "dotenv";
// dotenv.config();
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import userSchema from  "../models/user.model.js"

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "https://linkgenerator-backend.onrender.com/api/v1/api/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await userSchema.findOne({ email: profile.emails[0].value });

//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser = await userSchema.create({
//           userName: profile.displayName,
//           email: profile.emails[0].value,
//           password: "GoogleAuthUser", // optional placeholder
//           phone: "0000000000",        // optional placeholder
//           profileImg: profile.photos[0].value,
//           role: "user",
//         });

//         return done(null, newUser);
//       } catch (error) {
//         done(error, false);
//       }
//     }
//   )
// );

// export default passport;
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userSchema from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://linkgenerator-backend.onrender.com/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Check if user already exists
        let user = await userSchema.findOne({ email });

        if (!user) {
          // Assign admin role based on email domain or custom condition
          const isAdminEmail = email.endsWith("@yourcompany.com");

          user = await userSchema.create({
            userName: profile.displayName,
            email,
            password: "GoogleAuthUser", // placeholder
            phone: "0000000000",         // placeholder
            profileImg: profile.photos[0].value,
            role: isAdminEmail ? "admin" : "user",
            isActive: true,              // default active
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
