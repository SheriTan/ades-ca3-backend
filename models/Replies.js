// Imports
var db = require('../controller/databaseConfig');

// Objects/Functions
var Replies = {
    
    // Add Comment
    insert: function (uid, tid, content, callback) {
        var content = content;

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                var sql = `
                    Insert into
                    reply
                    (content, u_id, thread_id)
                    values
                    (?,?,?);
                    `;

                conn.query(sql, [content, uid, tid], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                })
            }
        })
    },
    
    // Find All Comments for a Specific Thread
    findByID: function(id, callback) {  
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                var sql = `
                Select r.reply_id, r.content, r.u_id, r.thread_id, r.created_at,
                u.username
                from reply as r, user as u
                where r.u_id = u.user_id and
                r.thread_id = ?
                order by 1 asc;
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
module.exports = Replies;