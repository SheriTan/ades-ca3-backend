// Imports
var db = require('../controller/databaseConfig');

var Users = {

    // Add a User
    register: function (user, callback) {
        var username = user.username;
        var password = user.password;

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                var sql = `
                Insert into
                user
                (username, password)
                values
                (?,?)
                `;

                conn.query(sql, [username, password], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        })
    },

    // Verify login User
    verify: function (username, password, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {

            if (err) {
                console.log(err);
                return callback(err, null);
            }

            else {
                var sql = `
             Select
                  * 
             from
                  user 
             where
                  username = ? 
                  and password = ?;
             `

                conn.query(sql, [username, password], (error, results) => {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    // any query that involves a select statement, select statement always returns an array(even if there nothing is in the array -> null)
                    if (results.length === 0) {
                        return callback(null, null);

                    }
                    // -> In this example, results[0] is the only element in the result sarray
                    else {
                        const user = results[0];
                        return callback(null, user);
                    }
                });
            }
        });
    },
};

// Exports
module.exports = Users;