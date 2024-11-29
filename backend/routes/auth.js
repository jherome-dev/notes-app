const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/authControllers");
const { ensureAuthenticated } = require("../middleware/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-user", ensureAuthenticated, getUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const { user, token } = req.user;
    // Redirect to the client-side app with token and user data
    res.redirect(
<<<<<<< HEAD
      `${
        process.env.FRONTEND_URL
      }/google/callback?token=${token}&user=${encodeURIComponent(
=======
      `${process.env.FRONTEND_URL}/google/callback?token=${token}&user=${encodeURIComponent(
>>>>>>> c0b327f36c6713d63c14a689278599b86ea16a3f
        JSON.stringify(user)
      )}`
    );
  }
);

module.exports = router;
