const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/note");
require("./config/passport");

const app = express();

dotenv.config();
connectDB();

app.use(express.json());

app.use(
  cors({
    origin:
      "https://notes-app-frontend-jhbn3hnpl-mjheromes-projects.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/note", noteRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
