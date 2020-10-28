require('dotenv/config');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

// Session Connection
const DBOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const SConnection = mongoose.createConnection(process.env.MONGO_URL, DBOptions);

SConnection.on('error', (err) => console.log(err));
SConnection.once('open', () => console.log('Connected to The Database!'));

const MongoStore = require('connect-mongo')(session);
const sessionStore = new MongoStore({
    mongooseConnection: SConnection,
    collection: 'sessions'
});

// To Accept All Request Types
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: oneDay }
}))

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(port, () => console.log(`Listening on port ${port}`));
