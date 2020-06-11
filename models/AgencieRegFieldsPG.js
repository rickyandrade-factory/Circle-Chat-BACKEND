var config = require("../config/config");

let table = "agency_regi_fields";
let table2 = "fieldslist";

const getAgencyRegFields = (request, callback) => {
    if(!request.query.agency_id || request.query.agency_id=="" || request.query.agency_id<=0) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    }
    config.POOL.query("SELECT agf.*, fl.name FROM "+table+" as agf left join "+table2+" as fl on agf.fields = fl.id WHERE agf.agency_id = '"+request.query.agency_id+"' order by agf.fields ASC", (error, results) => {
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

const createAgencyRegFields = (request, callback) => {
    var insertString = "";
    if(
        !request.body.agency_id || request.body.agency_id=="" || 
        !request.body.fields || request.body.fields==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        let agency_id = request.body.agency_id;
        let fields = request.body.fields;
        var is_required = "false";
        if(request.body.is_required && request.body.is_required==="true") {
            is_required = "true";
        }
        insertString = "(agency_id, fields, is_required) VALUES ('"+agency_id+"', '"+fields+"', '"+is_required+"' )";
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

const updateAgencyRegFields = (request, callback) => {
    var updateString = "";
    var agency_id = 0;
    if(
        !request.body.id || request.body.id=="" || 
        !request.body.agency_id || request.body.agency_id=="" || 
        !request.body.fields || request.body.fields==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        id = request.body.id;
        agency_id = request.body.agency_id;
        let fields = request.body.fields;
        updateString = "fields = '"+fields+"' ";
        if(request.body.is_required && (request.body.is_required==="true" || request.body.is_required==="false")) {
            updateString += ", is_required = '"+request.body.is_required+"' ";
        }
    }
    config.POOL.query("UPDATE "+table+" SET "+updateString+" WHERE id =  '"+id+"' and agency_id =  '"+agency_id+"'", (error, results) => {
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

const deleteAgencyRegField = (request, callback) => {
    if(
        !request.body.id || request.body.id=="" ||
        !request.body.agency_id || request.body.agency_id==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    }
    config.POOL.query("DELETE FROM "+table+" WHERE id = '"+request.body.id+"' and agency_id = '"+request.body.agency_id+"' ", (error, results) => {
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
    getAgencyRegFields,
    createAgencyRegFields,
    updateAgencyRegFields,
    deleteAgencyRegField
}