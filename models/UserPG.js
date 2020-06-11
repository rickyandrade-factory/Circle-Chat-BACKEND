var config = require("../config/config");

let table = "users";
let table2 = "users_fields";
let table3 = "fieldslist";

const getUser = async (request, callback) => {
    if(
        !request.query.userid || request.query.userid==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    }
    let userid = request.query.userid;
    await config.POOL.query("SELECT * FROM "+table+" WHERE id = '"+userid+"' ORDER BY id ASC", async (error, results) => {
        if(results.rowCount==0) {
            callback(true, { 
                status: 404, 
                data: { 
                    message: "User not found." 
                }
            });
        }
        if (error!="" && error!==undefined) {
            callback(true, { 
                status: 401, 
                data: error
            });
        }
        /* === */
        if(results.rowCount>0) {
            await config.POOL.query("SELECT ul.name, uf.value FROM "+table2+" as uf LEFT JOIN "+table3+" as ul ON uf.field_id = ul.id where uf.user_id = '"+userid+"' order by uf.field_id asc", async (error1, results1) => {
                if(results1.rowCount>0) {
                    results1.rows.forEach(element => {
                        results.rows[0][element.name]=element.value;
                    });
                }
                callback(false, {
                    status: 200, 
                    data: results.rows
                });
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
    if(
        !request.body.email || request.body.email=="" || 
        !request.body.password || request.body.password==""
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
        loginString = " WHERE email = '"+email+"' AND password = '"+password+"'";
    }
    config.POOL.query("SELECT * FROM "+table + loginString, (error, results) => {
        if(results.rowCount==0) {
            callback(true, { 
                status: 404, 
                data: { 
                    message: "User not found." 
                }
            });
        }
        if (error!="" && error!==undefined) {
            callback(true, { 
                status: 401, 
                data: error
            });
        }
        if(results.rows[0].status=="0" || results.rows[0].status==0) {
            callback(true, { 
                status: 403, 
                data: {
                    message: "Your account is not active. Please contact admin."
                }
            });
        }
        delete results.rows[0].password;
        callback(false, { 
            status: 200, 
            data: results.rows
        });
    })
}

const userForgotPassword = (request, callback) => {
    var loginString = "";
    if(
        !request.body.email || request.body.email==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        let email = request.body.email;
        loginString = " WHERE email = '"+email+"'";
    }
    config.POOL.query("SELECT * FROM "+table + loginString, (error, results) => {
        if(results.rowCount==0) {
            callback(true, { 
                status: 404, 
                data: { 
                    message: "User not found." 
                }
            });
        }
        if (error!="" && error!==undefined) {
            callback(true, { 
                status: 401, 
                data: error
            });
            throw error
        }
        if(results.rows[0].status=="0" || results.rows[0].status==0) {
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
    if(
        !request.body.agency_id || request.body.agency_id=="" || 
        !request.body.email || request.body.email=="" || 
        !request.body.password || request.body.password=="" ||
        !request.body.status || request.body.status==""
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
        insertString = "(agency_id, email, password, status) VALUES ('"+agency_id+"', '"+email+"', '"+password+"', '"+status+"' )";
    }
    config.POOL.query("INSERT INTO "+table+" "+insertString+" RETURNING id ", (error, results) => {
        if (error!="" && error!==undefined) {
            callback(true, { 
                status: 401, 
                data: error
            });
        }
        
        let user_id = results.rows[0].id;
        if(
            request.body.userdetail && request.body.userdetail!=""
        ) {
            let varUserdetail = JSON.parse(request.body.userdetail);
            var field_id = 0;
            var value = "";
            var insertString2 = "";
            request.body.userdetail = varUserdetail;
            varUserdetail.forEach(element => {
                field_id = element.field_id;
                value = element.value;
                if(
                    field_id > 0 && field_id!=""
                ) {
                    insertString2 = "(agency_id, user_id, field_id, value) VALUES ('"+agency_id+"', '"+user_id+"', '"+field_id+"', '"+value+"' )";
                    config.POOL.query("INSERT INTO "+table2+" "+insertString2+"");
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
    if(
        !request.body.agency_id || request.body.agency_id=="" || 
        !request.body.email || request.body.email=="" ||
        !request.body.status || request.body.status=="" ||
        !request.body.id || request.body.id==""
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
        if(request.body.password && request.body.password!="") {
            password = request.body.password;
            delete request.body.password;
        }
        updateString = "agency_id = '"+agency_id+"', email = '"+email+"', status = '"+status+"'";
        if(password!="") {
            updateString += ", password = '"+password+"' ";
        }
    }
    let user_id = request.body.id;
    await config.POOL.query("UPDATE "+table+" SET "+updateString+" WHERE id =  '"+user_id+"'", async (error, results) => {
        if (error!="" && error!==undefined) {
            callback(true, { 
                status: 401, 
                data: error
            });
        }
        if(
            request.body.userdetail && request.body.userdetail!=""
        ) {
            let varUserdetail = JSON.parse(request.body.userdetail);
            var field_id = 0;
            var value = "";
            var agency_id = request.body.agency_id;
            var insertString2 = "";
            var updateString2 = "";
            request.body.userdetail = varUserdetail;
            await varUserdetail.forEach(async element => {
                field_id = await element.field_id;
                value = element.value;
                if(
                    field_id > 0 && field_id!=""
                ) { 
                    await config.POOL.query("SELECT id FROM "+table2+" WHERE user_id = '"+user_id+"' AND field_id = '"+field_id+"' ", async (error, qresult) => {
                        if(qresult.rowCount==0){
                            insertString2 = "(agency_id, user_id, field_id, value) VALUES ('"+agency_id+"', '"+user_id+"', '"+field_id+"', '"+value+"' )";
                            await config.POOL.query("INSERT INTO "+table2+" "+insertString2+"");
                        } else {
                            console.log("UPDATE "+table2+" SET "+updateString2+" WHERE user_id = '"+user_id+"' AND field_id = '"+field_id+"' ");
                            console.log("±±±±±±±±±±");
                            updateString2 = "value = '"+value+"' ";
                            await config.POOL.query("UPDATE "+table2+" SET "+updateString2+" WHERE user_id = '"+user_id+"' AND field_id = '"+field_id+"' ");
                        }
                    });
                }
            });
        }
        // delete request.body.userdetail;
        // callback(false, { 
        //     status: 200, 
        //     data: request.body
        // });
        await config.POOL.query("SELECT * FROM "+table+" WHERE id = '"+user_id+"' ORDER BY id ASC", async (error, results1) => {
            if(results1.rowCount==0) {
                callback(true, { 
                    status: 404, 
                    data: { 
                        message: "User not found." 
                    }
                });
            }
            if (error!="" && error!==undefined) {
                callback(true, { 
                    status: 401, 
                    data: error
                });
            }
            /* === */
            if(results1.rowCount>0) {
                await config.POOL.query("SELECT ul.name, uf.value FROM "+table2+" as uf LEFT JOIN "+table3+" as ul ON uf.field_id = ul.id where uf.user_id = '"+user_id+"' order by uf.field_id asc", async (error1, results2) => {
                    if(results2.rowCount>0) {
                        results2.rows.forEach(element => {
                            results1.rows[0][element.name]=element.value;
                        });
                    }
                    callback(false, {
                        status: 200, 
                        data: results1.rows
                    });
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
    if(
        !request.body.id || request.body.id==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        var id = request.body.id;
        if(status == 0){
            message = "User Deactivated successfully";
        }
        if(status == 1){
            message = "User Activated successfully";
        }
        config.POOL.query("UPDATE "+table+" SET status = '"+status+"' WHERE id = '"+id+"' ", (error, results) => {
            if (error!="" && error!==undefined) {
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
    if(
        !request.body.id || request.body.id==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    }
    config.POOL.query("DELETE FROM "+table+" WHERE id = '"+request.body.id+"' ", (error, results) => {
        if (error!="" && error!==undefined) {
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

module.exports = {
    getUser,
    loginUser,
    userForgotPassword,
    createUser,
    updateUser,
    updateStatus,
    deleteUser
}