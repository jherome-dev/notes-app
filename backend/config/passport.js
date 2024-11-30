const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/User");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;

      try {
        let user = await User.findOne({ googleId: id });

        if (user) {
          // User found, generate a JWT
          const token = generateToken(user._id);
          return done(null, { user, token });
        } else {
          // User not found, create a new one
          user = await User.create({
            googleId: id,
            name: displayName,
            email: emails[0].value,
            password: "N/A",
          });
          const token = generateToken(user._id);
          return done(null, { user, token });
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // Ensure you are accessing the correct property
  done(null, user.user ? user.user._id : user._id); // Adjusted line
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password"); // Exclude password
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
