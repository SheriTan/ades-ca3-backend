// Imports
var db = require('../controller/databaseConfig');

// Objects/Functions
var Threads = {

    // Add Post
    insert: function (id, thread, callback) {
        var title = thread.title;
        var description = thread.description;

        var conn = db.getConnection();
        conn.connect(function (err){
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                var sql = `
                Insert into
                threads
                (title, description, user_id)
                values
                (?,?,?);
                `;

                conn.query(sql, [title,description,id], function (err, result){
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null, result);
                    }
                })
            }
        })
    },

    // Get All Threads
    getAll: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                var sql = `
                Select t.thread_id, t.title, t.description, t.user_id, t.created_at,
                u.username
                from threads as t, user as u
                where t.user_id = u.user_id
                order by t.thread_id asc;
                `;

                conn.query(sql, [], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    // Find Specific Thread
    findByID: function(id, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                var sql = `
                Select t.thread_id, t.title, t.description, t.user_id, t.created_at,
                u.username
                from threads as t, user as u
                where t.user_id = u.user_id and
                t.thread_id = ?;
                `;
                conn.query(sql, [id], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    }
}

// Exports
module.exports = Threads;