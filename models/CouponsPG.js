var config = require("../config/config");

let table = "coupons";

const getCoupons = (request, callback) => {
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

const getActiveCoupons = (request, callback) => {
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

const createCoupon = (request, callback) => {
    var insertString = "";
    if(
        !request.body.name || request.body.name=="" || 
        !request.body.discount_type || request.body.discount_type=="" ||
        !request.body.discount || request.body.discount=="" ||
        !request.body.duration || request.body.duration=="" ||
        !request.body.months || request.body.months==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        let name = request.body.name;
        let discount_type = request.body.discount_type;
        let discount = request.body.discount;
        let duration = request.body.duration;
        let months = request.body.months;
        insertString = "(name, discount_type, discount, duration, months, is_active, is_deleted) VALUES ('"+name+"', '"+discount_type+"', '"+discount+"', '"+duration+"', '"+months+"', '1', '0')";
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

const updateCoupon = (request, callback) => {
    var updateString = "";
    if(
        !request.body.name || request.body.name=="" || 
        !request.body.discount_type || request.body.discount_type=="" ||
        !request.body.discount || request.body.discount=="" ||
        !request.body.duration || request.body.duration=="" ||
        !request.body.months || request.body.months=="" ||
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
        let discount_type = request.body.discount_type;
        let discount = request.body.discount;
        let duration = request.body.duration;
        let months = request.body.months;
        updateString = "name = '"+name+"', discount_type = '"+discount_type+"', discount = '"+discount+"', duration = '"+duration+"', months = '"+months+"'";
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

const deleteCoupon = (request, callback) => {
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
    getCoupons,
    getActiveCoupons,
    createCoupon,
    updateCoupon,
    updateStatus,
    deleteCoupon
}