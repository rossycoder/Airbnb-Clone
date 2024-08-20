const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const { isLoggedIn } = require("./middleware");
const listing = require("./router/list.js");
const review = require("./router/review.js");
const user = require("./router/user.js");
const bodyParser = require('body-parser');
// const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const dburl = process.env.MONGO_DB; // Make sure this is correctly set in your .env file

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dburl, // Corrected typo here
    crypto: {
        secret: "mysupersecretstring"
    },
    touchAfter: 24 * 3600 // Time in seconds
});

store.on('error', (error) => {
    console.log("store error", error);
});

const sessionOptions = {
    store,
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: false, // Make sure this is false to avoid creating sessions for unauthenticated users
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
    console.log("Current user:", req.user);
    res.locals.currUser = req.user|| null;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user);
        } else {
            const newUser = new User({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
            });
            await newUser.save();
            return done(null, newUser);
        }
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    console.log("Serializing user:", user);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user with ID:", id);
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});



app.use("/listings", listing); // Protected route
app.use("/listings/:id/reviews", isLoggedIn, review); // Protected route
app.use("/", user);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

;
app.get('/some-route', (req, res) => {
    res.render('some-view', { currUser: req.user });
  });
  

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});



const connectDatabase = async () => {
  try {
    await mongoose.connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
    console.log("Connected to MongoDB");

  } catch (err) {
    console.error("Connection error:", err);
  }
}

connectDatabase();

