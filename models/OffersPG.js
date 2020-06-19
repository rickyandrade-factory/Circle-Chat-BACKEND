var config = require("../config/config");

let table = "offers";

const getOffers = (request, callback) => {
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

const createOffer = (request, callback) => {
    var insertString = "";
    if(
        !request.body.user_id || request.body.user_id=="" || 
        !request.body.chatroom_id || request.body.chatroom_id=="" ||
        !request.body.bill_id || request.body.bill_id==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        let user_id = request.body.user_id;
        let chatroom_id = request.body.chatroom_id;
        let bill_id = request.body.bill_id;
        insertString = "(user_id, chatroom_id, bill_id, is_deleted) VALUES ('"+user_id+"', '"+chatroom_id+"', '"+bill_id+"', '0')";
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

const updateOffer = (request, callback) => {
    var updateString = "";
    if(
        !request.body.user_id || request.body.user_id=="" || 
        !request.body.chatroom_id || request.body.chatroom_id=="" ||
        !request.body.bill_id || request.body.bill_id=="" ||
        !request.body.id || request.body.id==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        let user_id = request.body.user_id;
        let chatroom_id = request.body.chatroom_id;
        let bill_id = request.body.bill_id;
        updateString = "user_id = '"+user_id+"', chatroom_id = '"+chatroom_id+"', bill_id = '"+bill_id+"'";
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

const deleteOffer = (request, callback) => {
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
    getOffers,
    createOffer,
    updateOffer,
    deleteOffer
}