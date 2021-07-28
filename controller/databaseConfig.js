// imports
var mysql = require('mysql');

// objects/functions
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "remotemysql.com",
            user: "FTrbCnXcs6",
            password: "ftNqVeIuqh",
            database: "FTrbCnXcs6"
        });

        return conn;
    }
};

// exports
module.exports = dbconnect;