var config = require("../config/config");

let table = "chatrooms";

const getChatRooms = (request, callback) => {
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

const createChatRoom = (request, callback) => {
    var insertString = "";
    if(
        !request.body.name || request.body.name=="" || 
        !request.body.description || request.body.description=="" ||
        !request.body.type || request.body.type=="" ||
        !request.body.is_visible || request.body.is_visible=="" ||
        !request.body.can_post_message || request.body.can_post_message==""
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
        let type = request.body.type;
        let is_visible = request.body.is_visible;
        let can_post_message = request.body.can_post_message;
        insertString = "(name, description, type, is_visible, can_post_message, is_deleted) VALUES ('"+name+"', '"+description+"', '"+type+"', '"+is_visible+"', '"+can_post_message+"', '0')";
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

const updateChatRoom = (request, callback) => {
    var updateString = "";
    if(
        !request.body.name || request.body.name=="" || 
        !request.body.description || request.body.description=="" ||
        !request.body.type || request.body.type=="" ||
        !request.body.is_visible || request.body.is_visible=="" ||
        !request.body.can_post_message || request.body.can_post_message=="" ||
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
        let type = request.body.type;
        let is_visible = request.body.is_visible;
        let can_post_message = request.body.can_post_message;
        updateString = "name = '"+name+"', description = '"+description+"', type = '"+type+"', is_visible = '"+is_visible+"', can_post_message = '"+can_post_message+"'";
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

const deleteChatRoom = (request, callback) => {
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
    getChatRooms,
    createChatRoom,
    updateChatRoom,
    deleteChatRoom
}