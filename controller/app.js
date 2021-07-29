// Imports
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../auth/config');
const isLoggedInMiddleware = require('../auth/isLoggedInMiddleware');


const Threads = require('../models/Threads');
const Replies = require('../models/Replies');
const Users = require('../models/Users');

// Loads env variables
require('dotenv').config();
//----------------------------------------------
// Middleware functions
//----------------------------------------------
/**
 * prints useful debugging information about an endpoint
 * we are going to service
 * 
 * @param {object} req 
 *  request object
 * @param {object} res 
 *  response object
 * @param {function} next 
 *  reference to the next function to call
 */

var printDebugInfo = function (req, res, next) {
    console.log();
    console.log("--------------------[ Debug Info ]----------------------");

    console.log("Servicing " + req.url + " ...");

    console.log("> req.params: " + JSON.stringify(req.params) + " ...");
    console.log("> req.body: " + JSON.stringify(req.body) + " ...");

    console.log("------------------[ Debug Info Ends]--------------------");
    console.log();
    next();
}

var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

//----------------------------------------------
// MF Configurations
//----------------------------------------------
app.use(urlEncodedParser);
app.use(jsonParser);

app.options('*', cors());
app.use(cors());

//----------------------------------------------
// Endpoints
//----------------------------------------------

// Posts
// Create a New Post
app.post('/create/:id', printDebugInfo, isLoggedInMiddleware, function (req, res) {

    var id = req.params.id;

    var thread = {
        title: req.body.title,
        description: req.body.description
    }

    if (isNaN(id)) {
        res.status(401).send("Invalid User ID");
        return;
    }

    if (thread.title === '') {
        res.status(400).send("Please fill in the title!");
        return;
    }

    Threads.insert(id, thread, (err, result) => {
        if (!err) {
            console.log("Inserted post #" + result.insertId);
            res.status(201).send("You have created a new post! Your post's ID is #" + result.insertId);
        } else {
            res.status(500).send("Unknown error");
        }
    })
});

// Get all threads
app.get('/thread', function (req, res) {

    Threads.getAll(function (err, result) {
        if (!err) {
            res.status(200).send(result);

        } else {
            res.status(500).send("Unknown error");
        }
    });

});

// Get thread by ID
app.get('/thread/:id', function (req, res) {

    var id = req.params.id;

    Threads.findByID(id, function (err, result) {
        if (!err) {
            res.status(200).send(result);

        } else {
            res.status(500).send("Unknown error");
        }
    });

});

// Comments
// Create a New Comment
app.post('/reply/:uid/thread/:tid', printDebugInfo, isLoggedInMiddleware, function (req, res) {

    var uid = req.params.uid;
    var tid = req.params.tid;

    var content = req.body.content;

    if (isNaN(uid)) {
        res.status(403).send("Invalid User ID");
        return;
    }

    if (isNaN(tid)) {
        res.status(403).send("Invalid Thread ID");
        return;
    }

    if (content === '' || content === null) {
        res.status(400).send("Please type something!");
        return;
    }

    Replies.insert(uid, tid, content, (err, result) => {
        if (!err) {
            console.log("Inserted comment #" + result.insertId);
            res.status(201).send("You have commented on a post! Your comment's ID is #" + result.insertId);
        } else {
            res.status(500).send("Unknown error");
        }
    })
});

// Get all comments for a thread
app.get('/comments/:id', function (req, res) {

    var id = req.params.id;

    Replies.findByID(id, function (err, result) {
        if (!err) {
            res.status(200).send(result);

        } else {
            res.status(500).send("Unknown error");
        }
    });

});

// Users
// Register a New User
app.post('/users', printDebugInfo, function (req, res) {

    var user = {
        username: req.body.username,
        password: req.body.password,
    }

    if (user.username == null || user.username == '' ||
        user.password == null || user.password == '') {
        res.status(400).send("Please fill in all fields!");
        return;
    }

        Users.register(user, function (err, result) {
            if (!err) {

                var output = {
                    "userid": result.insertId
                }

                res.status(201).send(output);
            } else {
                if (err.errno == 1062) {
                    res.status(422).send("The username provided already exists.")
                } else {
                    res.status(500).send("Unknown error");
                }
            }
        });

});

// Login Endpoint
app.post('/login/', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    console.log("-------------------------------");
    console.log("Username: " + username);
    console.log("Password: " + password);
    console.log("-------------------------------");

    if (username == null || username == '' ||
        password == null || password == '') {
        res.status(400).send("Invalid login details.")
        return;
    }

    Users.verify(username, password, (error, user) => {
        if (error) {
            res.status(500).send("Internal Server Error");
            return;
        }
        if (user === null) {
            res.status(401).send("Incorect username and/or password.");
            return;
        }

        const payload = {
            user_id: user.user_id
        };

        /*
         Better to generate a token outside user.js (outside 
         model layer) as model layers only handles raw data
         Token generation should be handled in the controller layer
         - In this case, it is better to do the token generation in app.js
         instead of user.js
        */

        /*
        If token expiry time is not stated, a default expiry time is used 
        */

        jwt.sign(
            // (1): Payload
            payload,
            // (2): Secret Key
            JWT_SECRET,
            // (3) Signing Algorithm
            { algorithm: "HS256" },
            // (4) response handler (callback function)
            (error, token) => {
                if (error) {
                    console.log(error);
                    res.status(401).send("Token Error!");
                    return;
                }
                res.status(200).send({
                    token: token,
                    user_id: user.user_id,
                    username: user.username
                });
            });
    });
});

//----------------------------------------------
// Exports
//----------------------------------------------
module.exports = app;