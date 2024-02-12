const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { check, add, allData, latestNews, deleteOne, newUser } = require("./Mongo_CRUD");
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

connectDB();

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Set view engine
app.set("view engine", "ejs");

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.render("signup");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/check", urlencodedParser, async (req, res) => {
    const { email, password } = req.body;
    try {
        const isUserValid = await check(email, password);
        if (isUserValid) {
            const token = jwt.sign({ user: email }, process.env.secret_key);
            res.cookie('token', token, { httpOnly: true });
            res.redirect("/main");
        } else {
            res.send("bad");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await newUser(email, password);
        const token = jwt.sign({ user: email }, process.env.secret_key);
        res.cookie('token', token, { httpOnly: true });
        res.redirect("/main");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

app.get("/main", middleware, (req, res) => {
    res.render("main");
});

app.get('/items', middleware, async (req, res) => {
    try {
        const data = await allData();
        res.render("items", { data });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.post("/add", middleware, urlencodedParser, async (req, res) => {
    try {
        const obj = {
            'title': req.body.Title,
            'Discription': req.body.Discription,
            'url': req.body.url,
            'urlToImage': req.body.img,
            'published': req.body.published
        };
        await add(obj);
        console.log(obj);
        res.redirect("/main");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.post("/delete", middleware, async (req, res) => {
    try {
        console.log(req.body.delete);
        await deleteOne(req.body.delete);
        res.redirect("/items");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.get("/getNews", async (req, res) => {
    try {
        const db = client.db('DataBaseMedia'); // Replace 'media' with your database name
        const collection = db.collection('NewsApp'); // Replace 'NewsApp' with your collection name
        const data = await collection.find().limit(3).toArray(); // Limit to the first 3 articles
        res.json(data);
        console.log(res);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// Add routes for other pages: Home, Sports, About Us, and Contact
app.get("/home", middleware, (req, res) => {
    res.render("frontend/home.html");
});

app.get("/sports", middleware, (req, res) => {
    res.render("frontend/sports.html");
});

app.get("/aboutUs", middleware, (req, res) => {
    res.render("frontend/aboutUs.html");
});

app.get("/contact", middleware, (req, res) => {
    res.render("frontend/contact.html");
});

// Middleware function
async function middleware(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/');
        }
        const decoded = jwt.verify(token, process.env.secret_key);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send("Unauthorized");
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
