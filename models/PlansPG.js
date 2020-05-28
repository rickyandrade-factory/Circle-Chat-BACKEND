var config = require("../config/config");

let table = "plans";

const getPlans = (request, response) => {
    config.POOL.query('SELECT * FROM '+table+' ORDER BY id ASC', (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "data" : results.rows})
    })
}

const getActivePlans = (request, response) => {
    config.POOL.query("SELECT * FROM "+table+" WHERE status='1' ORDER BY id ASC", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "data" : results.rows})
    })
}

const createPlan = (request, response) => {
    config.POOL.query("INSERT INTO "+table+" (name, price, status) VALUES ('"+request.body.name+"', '"+request.body.price+"', '"+request.body.status+"')", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "message": "Record created"});
    })
}

const updatePlan = (request, response) => {
    config.POOL.query("UPDATE "+table+" SET name = '"+request.body.name+"', price = '"+request.body.price+"', status = '"+request.body.status+"' WHERE id =  '"+request.body.id+"'", (error, results) => {
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
    if(request.route.path=="/api/deactivatePlan"){
        status = 0;
        message = "Plan Deactivated successfully";
    }
    if(request.route.path=="/api/activatePlan"){
        status = 1;
        message = "Plan Activated successfully";
    }
    config.POOL.query("UPDATE "+table+" SET status = '"+status+"' WHERE id = '"+id+"' ", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "message": message});
    });
}

const deletePlan = (request, response) => {
    config.POOL.query("DELETE FROM "+table+" WHERE id = '"+request.body.id+"' ", (error, results) => {
        if (error!="" && error!==undefined) {
            response.status(401).json({"success" : false, "data" : error})
            throw error
        }
        response.status(200).json({"success" : true, "message": "Record deleted successfully."})
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