var config = require("../config/config");

let table = "widgets";

const getWidgets = (request, callback) => {
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

const getActiveWidgets = (request, callback) => {
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

const createWidget = (request, callback) => {
    var insertString = "";
    if(
        !request.body.name || request.body.name=="" || 
        !request.body.link || request.body.link=="" || 
        !request.body.position || request.body.position=="" ||
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
        let link = request.body.link;
        let position = request.body.position;
        let status = request.body.status;
        let description = request.body.description;
        insertString = "(name, link, status, position, description) VALUES ('"+name+"', '"+link+"', '"+status+"', '"+position+"', '"+description+"' )";
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

const updateWidget = (request, callback) => {
    var updateString = "";
    if(
        !request.body.name || request.body.name=="" || 
        !request.body.link || request.body.link=="" || 
        !request.body.position || request.body.position=="" ||
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
        let link = request.body.link;
        let position = request.body.position;
        let status = request.body.status;
        let description = request.body.description;
        updateString = "name = '"+name+"', link = '"+link+"', status = '"+status+"', position = '"+position+"'";
        if (!request.body.status || request.body.status=="") {
            updateString += ", description = '"+description+"' ";
        }
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
            message = "Widget Deactivated successfully";
        }
        if(status == 1){
            message = "Widget Activated successfully";
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

const deleteWidget = (request, callback) => {
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
    getWidgets,
    getActiveWidgets,
    createWidget,
    updateStatus,
    updateWidget,
    deleteWidget
}