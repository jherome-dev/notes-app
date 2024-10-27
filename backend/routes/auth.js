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
      `http://localhost:5173/google/callback?token=${token}&user=${JSON.stringify(
        user
      )}`
    );
  }
);

module.exports = router;
