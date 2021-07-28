//----------------------------------------------
// imports
//----------------------------------------------
const jwt = require("jsonwebtoken");
const JWT_SECRET = require('./config');

//----------------------------------------------
// objects/ functions
//----------------------------------------------
var check = (req, res, next) => {
     const authHeader = req.headers.authorization;
     if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
          res.status(401).send("You have not logged in!!");
          return;
     }
     const token = authHeader.replace("Bearer ", "");

     jwt.verify(
          token,
          JWT_SECRET,
          { algorithms: ["HS256"] },
          (error, decodedToken) => {
               if (error) {
                    res.status(401).send("Invalid authentication!!");
                    return;
               }

               // decodedToken is the PayLoad that you used 
               // earlier to sign the token

               req.decodedToken = decodedToken;
               next();
          });
};

//----------------------------------------------
// Exports
//----------------------------------------------
module.exports = check;
