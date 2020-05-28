var config = require("../config/config");

let table = "widgets";

const getWidgets = (request, response) => {
    config.POOL.query('SELECT * FROM '+table+' ORDER BY id ASC', (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "data" : results.rows})
    })
}

const getActiveWidgets = (request, response) => {
    config.POOL.query("SELECT * FROM "+table+" WHERE status='1' ORDER BY id ASC", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "data" : results.rows})
    })
}

const createWidget = (request, response) => {
    config.POOL.query("INSERT INTO "+table+" (name, link, status, position, description) VALUES ('"+request.body.name+"', '"+request.body.link+"', '"+request.body.status+"', '"+request.body.position+"', '"+request.body.description+"')", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "message": "Record created"});
    })
}

const updateWidget = (request, response) => {
    config.POOL.query("UPDATE "+table+" SET name = '"+request.body.name+"', link = '"+request.body.link+"', status = '"+request.body.status+"', position = '"+request.body.position+"', description = '"+request.body.description+"' WHERE id =  '"+request.body.id+"'", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "message": "Record updated"});
    })
}

const updateStatus = (request, response) => {
    var status = "";
    var message = "";
    var id = request.body.id;
    if(request.route.path=="/api/deactivateWidget"){
        status = 0;
        message = "Widget Deactivated successfully";
    }
    if(request.route.path=="/api/activateWidget"){
        status = 1;
        message = "Widget Activated successfully";
    }
    config.POOL.query("UPDATE "+table+" SET status = '"+status+"' WHERE id = '"+id+"' ", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "message": message});
    });
}

const deleteWidget = (request, response) => {
    config.POOL.query("DELETE FROM "+table+" WHERE id = '"+request.body.id+"' ", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "message": "Record deleted successfully."})
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