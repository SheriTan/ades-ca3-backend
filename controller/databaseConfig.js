// imports
var mysql = require('mysql');

// objects/functions
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "ST0503",
            database: "spdiscuss"
        });

        return conn;
    }
};

// exports
module.exports = dbconnect;