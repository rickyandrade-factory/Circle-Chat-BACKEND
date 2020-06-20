var config = require("../config/config");

let table = "billingplans";

const getBillingPlans = (request, callback) => {
    config.POOL.query('SELECT * FROM '+table+' WHERE is_deleted=0 ORDER BY id ASC', (error, results) => {
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

const getActiveBillingPlans = (request, callback) => {
    config.POOL.query('SELECT * FROM '+table+' WHERE is_active=1 AND is_deleted=0 ORDER BY id ASC', (error, results) => {
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

const createBillingPlan = (request, callback) => {
    var insertString = "";
    if(
        !request.body.name || request.body.name=="" || 
        !request.body.description || request.body.description=="" ||
        !request.body.statement_description || request.body.statement_description=="" ||
        !request.body.price || request.body.price=="" ||
        !request.body.price_type || request.body.price_type=="" ||
        !request.body.is_oneoff || request.body.is_oneoff=="" ||
        !request.body.bill_every || request.body.bill_every=="" ||
        !request.body.trial || request.body.trial=="" ||
        !request.body.sub_plan || request.body.sub_plan=="" ||
        !request.body.sub_coupon || request.body.sub_coupon==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        let name = request.body.name;
        let description = request.body.description;
        let statement_description = request.body.statement_description;
        let price = request.body.price;
        let price_type = request.body.price_type;
        let is_oneoff = request.body.is_oneoff;
        let bill_every = request.body.bill_every;
        let trial = request.body.trial;
        let sub_plan = request.body.sub_plan;
        let sub_coupon = request.body.sub_coupon;
        insertString = "(name, description, statement_description, price, price_type, is_oneoff, bill_every, trial, sub_plan, sub_coupon, is_active, is_deleted) VALUES ('"+name+"', '"+description+"', '"+statement_description+"', '"+price+"', '"+price_type+"', '"+is_oneoff+"', '"+bill_every+"', '"+trial+"', '"+sub_plan+"', '"+sub_coupon+"', '1', '0')";
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

const updateBillingPlan = (request, callback) => {
    var updateString = "";
    if(
        !request.body.name || request.body.name=="" || 
        !request.body.description || request.body.description=="" ||
        !request.body.statement_description || request.body.statement_description=="" ||
        !request.body.price || request.body.price=="" ||
        !request.body.price_type || request.body.price_type=="" ||
        !request.body.is_oneoff || request.body.is_oneoff=="" ||
        !request.body.bill_every || request.body.bill_every=="" ||
        !request.body.trial || request.body.trial=="" ||
        !request.body.sub_plan || request.body.sub_plan=="" ||
        !request.body.sub_coupon || request.body.sub_coupon=="" ||
        !request.body.id || request.body.id==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        let name = request.body.name;
        let description = request.body.description;
        let statement_description = request.body.statement_description;
        let price = request.body.price;
        let price_type = request.body.price_type;
        let is_oneoff = request.body.is_oneoff;
        let bill_every = request.body.bill_every;
        let trial = request.body.trial;
        let sub_plan = request.body.sub_plan;
        let sub_coupon = request.body.sub_coupon;
        updateString = "name = '"+name+"', description = '"+description+"', statement_description = '"+statement_description+"', price = '"+price+"', price_type = '"+price_type+"', is_oneoff = '"+is_oneoff+"', bill_every = '"+bill_every+"', trial = '"+trial+"', sub_plan = '"+sub_plan+"', sub_coupon = '"+sub_coupon+"'";
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
            message = "Deactivated successfully";
        }
        if(status == 1){
            message = "Activated successfully";
        }
        config.POOL.query("UPDATE "+table+" SET is_active = '"+status+"' WHERE id = '"+id+"' ", (error, results) => {
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

const deleteBillingPlan = (request, callback) => {
    var updateString = "";
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
        updateString = "is_deleted = '1'";
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
                message: "Record deleted."
            }
        });
    })
}

module.exports = {
    getBillingPlans,
    getActiveBillingPlans,
    createBillingPlan,
    updateBillingPlan,
    updateStatus,
    deleteBillingPlan
}