var config = require("../config/config");
var UserModel = require('../models/User');
let table = "users";
let table2 = "users_fields";
let table3 = "fieldslist";
USER_STATUS_OFFLINE = 0;
USER_STATUS_ONLINE = 1;
USER_STATUS_AWAY = 2;
USER_STATUS_BUSY = 3;

const getUser = async (request, callback) => {
    if (
        !request.query.userid || request.query.userid == ""
    ) {
        callback(true, {
            status: 400,
            data: {
                message: "Please enter all required fields."
            }
        });
    }
    let userid = request.query.userid;
    await config.POOL.query("SELECT * FROM " + table + " WHERE id = '" + userid + "' ORDER BY id ASC", async (error, results) => {
        if (results.rowCount == 0) {
            callback(true, {
                status: 404,
                data: {
                    message: "User not found."
                }
            });
        }
        if (error != "" && error !== undefined) {
            callback(true, {
                status: 401,
                data: error
            });
        }
        /* === */
        if (results.rowCount > 0) {
            var resData = await getUserDetail(userid);
            resData.forEach(element => {
                results.rows[0][removeSpecialChar(element.name)] = element.value;
            });
            callback(false, {
                status: 200,
                data: results.rows
            });
        } else {
            callback(false, {
                status: 200,
                data: results.rows
            });
        }
        /* === */
    })
}

const loginUser = (request, callback) => {
    var loginString = "";
    if (
        !request.body.email || request.body.email == "" ||
        !request.body.password || request.body.password == ""
    ) {
        callback(true, {
            status: 400,
            data: {
                message: "Please enter all required fields."
            }
        });
    } else {
        let email = request.body.email;
        let password = request.body.password;
        loginString = " WHERE email = '" + email + "' AND password = '" + password + "'";
    }
    config.POOL.query("SELECT * FROM " + table + loginString, (error, results) => {
        if (results.rowCount == 0) {
            callback(true, {
                status: 200,
                data: {
                    message: "Incorrect email or password"
                }
            });
        }
        if (error != "" && error !== undefined) {
            callback(true, {
                status: 401,
                data: error
            });
        }
        if (results.rowCount > 0) {
            if (results.rows[0].status == "0" || results.rows[0].status == 0) {
                callback(true, {
                    status: 403,
                    data: {
                        message: "Your account is not active. Please contact admin."
                    }
                });
            }
            delete results.rows[0].password;
            setOnlineAndReturn(results.rows[0], function (err, finalUser) {
                callback(false, {
                    status: 200,
                    data: finalUser
                });
            });
        }
    })
}

const setOnlineAndReturn = async (user, callback) => {
    await config.POOL.query("UPDATE " + table + " SET online_status = '" + USER_STATUS_ONLINE + "' WHERE id = '" + user.id + "' RETURNING online_status ", async (error, updatedUser) => {
        if (updatedUser.rows.length > 0) {
            user.online_status = updatedUser.rows[0].online_status
        }
        callback(error, user);
    });
}

const userForgotPassword = (request, callback) => {
    var loginString = "";
    if (
        !request.body.email || request.body.email == ""
    ) {
        callback(true, {
            status: 400,
            data: {
                message: "Please enter all required fields."
            }
        });
    } else {
        let email = request.body.email;
        loginString = " WHERE email = '" + email + "'";
    }
    config.POOL.query("SELECT * FROM " + table + loginString, (error, results) => {
        if (results.rowCount == 0) {
            callback(true, {
                status: 404,
                data: {
                    message: "User not found."
                }
            });
        }
        if (error != "" && error !== undefined) {
            callback(true, {
                status: 401,
                data: error
            });
            throw error
        }
        if (results.rows[0].status == "0" || results.rows[0].status == 0) {
            callback(true, {
                status: 403,
                data: {
                    message: "Your account is not active. Please contact admin."
                }
            });
        }
        callback(false, {
            status: 200,
            data: results.rows
        });
    })
}

const createUser = (request, callback) => {
    var insertString = "";
    var agency_id = "";
    if (
        !request.body.agency_id || request.body.agency_id == "" ||
        !request.body.email || request.body.email == "" ||
        !request.body.password || request.body.password == "" ||
        !request.body.status || request.body.status == ""
    ) {
        callback(true, {
            status: 400,
            data: {
                message: "Please enter all required fields."
            }
        });
    } else {
        agency_id = request.body.agency_id;
        let email = request.body.email;
        let password = request.body.password;
        let status = request.body.status;
        var keys = Object.keys(request.body);
        var columsn = "(" + keys.join(', ') + ")";
        values = "(";
        for (var i = 0; i <= keys.length; i++) {
            request.body[keys[i]]
            if (request.body[keys[i]]) {
                if (typeof request.body[keys[i]] == 'string') {
                    values += "'" + request.body[keys[i]] + "'";
                } else {
                    values += request.body[keys[i]];
                }
                if (i == (keys.length - 1)) {
                    values += ")";
                } else {
                    values += ",";
                }
            }
        }
        console.log(values);
        var insertString = columsn + " VALUES " + values;
        console.log(insertString);
        // insertString = "(agency_id, email, password, status) VALUES ('" + agency_id + "', '" + email + "', '" + password + "', '" + status + "' )";
    }
    config.POOL.query("INSERT INTO " + table + " " + insertString + " RETURNING id ", (error, results) => {
        if (error && error !== undefined) {
            callback(true, {
                status: 401,
                data: error
            });
        }
        // console.log(error);
        console.log(results);
        let user_id = results.rows[0].id;
        if (
            request.body.userdetail && request.body.userdetail != ""
        ) {
            let varUserdetail = JSON.parse(request.body.userdetail);
            var field_id = 0;
            var value = "";
            var insertString2 = "";
            request.body.userdetail = varUserdetail;
            varUserdetail.forEach(element => {
                field_id = element.field_id;
                value = element.value;
                if (
                    field_id > 0 && field_id != ""
                ) {
                    insertString2 = "(agency_id, user_id, field_id, value) VALUES ('" + agency_id + "', '" + user_id + "', '" + field_id + "', '" + value + "' )";
                    config.POOL.query("INSERT INTO " + table2 + " " + insertString2 + "");
                }
            });
        }
        delete request.body.password;
        delete request.body.userdetail;
        callback(false, {
            status: 200,
            data: request.body
        });
    })
}

const updateUser = async (request, callback) => {
    var updateString = "";
    if (
        !request.body.agency_id || request.body.agency_id == "" ||
        !request.body.email || request.body.email == "" ||
        !request.body.status || request.body.status == "" ||
        !request.body.id || request.body.id == ""
    ) {
        callback(true, {
            status: 400,
            data: {
                message: "Please enter all required fields."
            }
        });
    } else {
        let agency_id = request.body.agency_id;
        let email = request.body.email;
        let status = request.body.status;
        var password = "";
        if (request.body.password && request.body.password != "") {
            password = request.body.password;
            delete request.body.password;
        }
        updateString = "agency_id = '" + agency_id + "', email = '" + email + "', status = '" + status + "'";
        if (password != "") {
            updateString += ", password = '" + password + "' ";
        }
    }
    let user_id = request.body.id;
    await config.POOL.query("UPDATE " + table + " SET " + updateString + " WHERE id =  '" + user_id + "'", async (error, results) => {
        if (error != "" && error !== undefined) {
            callback(true, {
                status: 401,
                data: error
            });
        }
        if (
            request.body.userdetail && request.body.userdetail != ""
        ) {
            let varUserdetail = JSON.parse(request.body.userdetail);
            var field_id = 0;
            var value = "";
            var agency_id = request.body.agency_id;
            var insertString2 = "";
            var updateString2 = "";
            request.body.userdetail = varUserdetail;
            varUserdetail.forEach(element => {
                field_id = element.field_id;
                value = element.value;
                if (
                    field_id > 0 && field_id != ""
                ) {
                    config.POOL.query("SELECT id FROM " + table2 + " WHERE user_id = '" + user_id + "' AND field_id = '" + field_id + "' ", (error, qresult) => {
                        if (qresult.rowCount == 0) {
                            insertString2 = "(agency_id, user_id, field_id, value) VALUES ('" + agency_id + "', '" + user_id + "', '" + field_id + "', '" + value + "' )";
                            config.POOL.query("INSERT INTO " + table2 + " " + insertString2 + "");
                        } else {
                            updateString2 = "value = '" + element.value + "' ";
                            config.POOL.query("UPDATE " + table2 + " SET " + updateString2 + " WHERE user_id = '" + user_id + "' AND field_id = '" + element.field_id + "' ");
                        }
                    });
                }
            });
        }
        await config.POOL.query("SELECT * FROM " + table + " WHERE id = '" + user_id + "' ORDER BY id ASC", async (error, results1) => {
            if (results1.rowCount == 0) {
                callback(true, {
                    status: 404,
                    data: {
                        message: "User not found."
                    }
                });
            }
            if (error != "" && error !== undefined) {
                callback(true, {
                    status: 401,
                    data: error
                });
            }
            /* === */
            if (results1.rowCount > 0) {
                var resData = await getUserDetail(user_id);
                resData.forEach(element => {
                    results1.rows[0][removeSpecialChar(element.name)] = element.value;
                });
                callback(false, {
                    status: 200,
                    data: results1.rows
                });
            } else {
                callback(false, {
                    status: 200,
                    data: results1.rows
                });
            }
            /* === */
        })
    })
}

const updateStatus = (request, callback) => {
    var status = request.body.status;
    var message = "";
    if (
        !request.body.id || request.body.id == ""
    ) {
        callback(true, {
            status: 400,
            data: {
                message: "Please enter all required fields."
            }
        });
    } else {
        var id = request.body.id;
        if (status == 0) {
            message = "User Deactivated successfully";
        }
        if (status == 1) {
            message = "User Activated successfully";
        }
        config.POOL.query("UPDATE " + table + " SET status = '" + status + "' WHERE id = '" + id + "' ", (error, results) => {
            if (error != "" && error !== undefined) {
                callback(true, {
                    status: 401,
                    data: error
                });
            }
            callback(false, {
                status: 200,
                data: {
                    message: message
                }
            });
        });
    }
}

const deleteUser = (request, callback) => {
    if (
        !request.body.id || request.body.id == ""
    ) {
        callback(true, {
            status: 400,
            data: {
                message: "Please enter all required fields."
            }
        });
    }
    config.POOL.query("DELETE FROM " + table + " WHERE id = '" + request.body.id + "' ", (error, results) => {
        config.POOL.query("DELETE FROM " + table2 + " WHERE user_id = '" + request.body.id + "' ");
        if (error != "" && error !== undefined) {
            callback(true, {
                status: 401,
                data: error
            });
        }
        callback(false, {
            status: 200,
            data: {
                message: "Record deleted successfully."
            }
        });
    });
}

function getUserDetail(id) {
    return new Promise((resolve, reject) => {
        config.POOL.query("SELECT ul.name, uf.value FROM " + table2 + " as uf LEFT JOIN " + table3 + " as ul ON uf.field_id = ul.id where uf.user_id = '" + id + "' order by uf.field_id asc", async (error, results) => {
            return error ? reject(err) : resolve(results.rows);
        });
    });
}

function removeSpecialChar(string) {
    string = string.replace(" ", "_").replace(".", "").replace("'", "").replace("-", "_").toLowerCase();
    return string;
}

const migrateUser = (data, callback) => {
    UserModel.find(data, function (err, users) {
        callback(err, users.map((user) => {
            var insertString = "(agency_id, firstname, lastname, email, password, status) VALUES ('" + Math.floor(Math.random() * (99 - 1 + 1)) + 1 + "', '" + user.firstname + "', '" + user.lastname + "', '" + user.email + "', '" + user.password + "', '" + user.status + "' )";
            config.POOL.query("INSERT INTO " + table + " " + insertString + " RETURNING id ", (error, insertedUser) => {
                //todo add checks to see if migration succsesfull

            });
            return user;
        }));
    })
}

const migrateChatIds = (data, callback) => {
    UserModel.find(data, function (err, users) {
        callback(err, users.map((user) => {
            if (user && user._id) {
                config.POOL.query("UPDATE " + table + " SET chat_id = '" + user._id + "' WHERE email='" + user.email + "'", async (error, results) => {
                    if (error != "" && error !== undefined) {
                        return { status: 200, data: results }
                    }
                })
            }
        }));
    })
}

const getAllUser = async (req, callback) => {
    console.log(req.user);
    await config.POOL.query("SELECT * FROM " + table + " ORDER BY id DESC", async (error, results) => {
        console.log(results.rowCount);
        if (results.rowCount == 0) {
            callback(true, {
                status: 200,
                data: {
                    message: "No User found."
                }
            });
        }
        if (error != "" && error !== undefined) {
            callback(true, {
                status: 401,
                data: error
            });
        }
        /* === */
        if (results.rowCount > 0) {
            // var userid = 1;
            // var resData = await getUserDetail(userid);
            // resData.forEach(element => {
            //     results.rows[0][removeSpecialChar(element.name)] = element.value;
            // });
            callback(false, {
                status: 200,
                data: results.rows
            });
        } else {
            callback(false, {
                status: 200,
                data: results.rows
            });
        }
        /* === */
    })
}
module.exports = {
    getUser,
    loginUser,
    userForgotPassword,
    createUser,
    updateUser,
    updateStatus,
    deleteUser,
    getAllUser,
    setOnlineAndReturn,
    migrateUser,
    migrateChatIds,
}