var config = require("../config/config");

let table = "fieldslist";

const getRegFields = (request, response) => {
    config.POOL.query('SELECT * FROM '+table+' ORDER BY id ASC', (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "data" : results.rows})
    })
}

const getActiveRegFields = (request, response) => {
    config.POOL.query("SELECT * FROM "+table+" WHERE status='1' ORDER BY id ASC", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "data" : results.rows})
    })
}

const createRegField = (request, response) => {
    config.POOL.query("INSERT INTO "+table+" (name, status) VALUES ('"+request.body.name+"', '"+request.body.status+"')", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "message": "Record created"});
    })
}

const updateRegField = (request, response) => {
    config.POOL.query("UPDATE "+table+" SET name = '"+request.body.name+"', status = '"+request.body.status+"' WHERE id =  '"+request.body.id+"'", (error, results) => {
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
    if(request.route.path=="/api/deactivateRegField"){
        status = 0;
        message = "Widget Deactivated successfully";
    }
    if(request.route.path=="/api/activateRegField"){
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

const deleteRegField = (request, response) => {
    config.POOL.query("DELETE FROM "+table+" WHERE id = '"+request.body.id+"' ", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "message": "Record deleted successfully."})
    });
}

module.exports = {
    getRegFields,
    getActiveRegFields,
    createRegField,
    updateStatus,
    updateRegField,
    deleteRegField
}