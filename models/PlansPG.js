var config = require("../config/config");

let table = "plans";

const getPlans = (request, callback) => {
    config.POOL.query('SELECT * FROM '+table+' ORDER BY id ASC', (error, results) => {
        if (error!="" && error!==undefined) {
            callback(true, { 
                status: 401, 
                data: error
            });
        }
        callback(false, { 
            status: 200, 
            data: results.rows
        });
    })
}

const getActivePlans = (request, callback) => {
    config.POOL.query("SELECT * FROM "+table+" WHERE status='1' ORDER BY id ASC", (error, results) => {
        if (error!="" && error!==undefined) {
            callback(true, { 
                status: 401, 
                data: error
            });
        }
        callback(false, { 
            status: 200, 
            data: results.rows
        });
    })
}

const createPlan = (request, callback) => {
    var insertString = "";
    if(
        !request.body.name || request.body.name=="" || 
        !request.body.price || request.body.price=="" ||
        !request.body.status || request.body.status==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        let name = request.body.name;
        let price = request.body.price;
        let status = request.body.status;
        insertString = "(name, price, status) VALUES ('"+name+"', '"+price+"', '"+status+"' )";
    }
    config.POOL.query("INSERT INTO "+table+" "+insertString+" RETURNING id", (error, results) => {
        if (error!="" && error!==undefined) {
            callback(true, { 
                status: 401, 
                data: error
            });
        }
        callback(false, { 
            status: 200, 
            data: {
                message: "Record created."
            }
        });
    })
}

const updatePlan = (request, callback) => {
    var updateString = "";
    if(
        !request.body.name || request.body.name=="" || 
        !request.body.price || request.body.price=="" ||
        !request.body.status || request.body.status==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        let name = request.body.name;
        let price = request.body.price;
        let status = request.body.status;
        updateString = "name = '"+name+"', price = '"+price+"', status = '"+status+"'";
    }
    config.POOL.query("UPDATE "+table+" SET "+updateString+" WHERE id =  '"+request.body.id+"'", (error, results) => {
        if (error!="" && error!==undefined) {
            callback(true, { 
                status: 401, 
                data: error
            });
        }
        callback(false, { 
            status: 200, 
            data: {
                message: "Record updated."
            }
        });
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
            message = "Plan Deactivated successfully";
        }
        if(status == 1){
            message = "Plan Activated successfully";
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

const deletePlan = (request, callback) => {
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
    getPlans,
    getActivePlans,
    createPlan,
    updateStatus,
    updatePlan,
    deletePlan
}