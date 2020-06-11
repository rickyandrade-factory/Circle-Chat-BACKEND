var config = require("../config/config");
const multer = require("multer");
const path = require("path");
const helperIF = require('../helpers/imageFilter');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../public/upload/agency_logo/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let table = "agencies";

const getAgencies = (request, callback) => {
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

const getActiveAgencies = (request, callback) => {
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

const createAgency = (request, callback) => {
    var insertString = "";
    if(
        !request.body.firstname || request.body.firstname=="" || 
        !request.body.lastname || request.body.lastname=="" || 
        !request.body.agency_name || request.body.agency_name=="" || 
        !request.body.email || request.body.email=="" || 
        !request.body.password || request.body.password=="" || 
        !request.body.address || request.body.address=="" || 
        !request.body.city || request.body.city=="" || 
        !request.body.zip || request.body.zip=="" || 
        !request.body.state || request.body.state=="" || 
        !request.body.plan || request.body.plan=="" || 
        !request.body.status || request.body.status==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        /*=============*
        let upload = multer({ storage: storage, fileFilter: helperIF.imageFilter }).single('logo');
        upload(request, response, function(err) {
            if (request.fileValidationError) {
                return response.status(401).json({"success" : false, "data" : request.fileValidationError});
            }
            else if (!request.file) {
                return response.status(400).json({"success" : false, "message": "Please select an image to upload"});
            }
            else if (err instanceof multer.MulterError) {
                return response.status(401).json({"success" : false, "data" : err});
            }
            else if (err) {
                return response.status(401).json({"success" : false, "data" : err});
            }
            return request.file.filename;
        });
        /*=============*/
        let firstname = request.body.firstname;
        let lastname = request.body.lastname;
        let agency_name = request.body.agency_name;
        let email = request.body.email;
        let password = request.body.password;
        let address = request.body.address;
        let logo = "";
        let city = request.body.city;
        let zip = request.body.zip;
        let state = request.body.state;
        let plan = request.body.plan;
        let status = request.body.status;
        insertString = "(firstname, lastname, agency_name, email, password, logo, address, city, zip, state, plan, status) VALUES ('"+firstname+"', '"+lastname+"', '"+agency_name+"', '"+email+"', '"+password+"', '"+logo+"', '"+address+"', '"+city+"', '"+zip+"', '"+state+"', '"+plan+"', '"+status+"' )";
    }
    config.POOL.query("INSERT INTO "+table+" "+insertString+" RETURNING id ", (error, results) => {
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

const updateAgency = (request, callback) => {
    var updateString = "";
    if(
        !request.body.firstname || request.body.firstname=="" || 
        !request.body.lastname || request.body.lastname=="" || 
        !request.body.agency_name || request.body.agency_name=="" || 
        !request.body.email || request.body.email=="" || 
        !request.body.address || request.body.address=="" || 
        !request.body.city || request.body.city=="" || 
        !request.body.zip || request.body.zip=="" || 
        !request.body.state || request.body.state=="" || 
        !request.body.plan || request.body.plan=="" || 
        !request.body.status || request.body.status==""
    ) {
        callback(true, { 
            status: 400, 
            data: { 
                message: "Please enter all required fields." 
            }
        });
    } else {
        let firstname = request.body.firstname;
        let lastname = request.body.lastname;
        let agency_name = request.body.agency_name;
        let email = request.body.email;
        var password = "";
        if(request.body.password && request.body.password!="") {
            password = request.body.password;
        }
        let address = request.body.address;
        let logo = "";
        let city = request.body.city;
        let zip = request.body.zip;
        let state = request.body.state;
        let plan = request.body.plan;
        let status = request.body.status;
        updateString = "firstname = '"+firstname+"', lastname = '"+lastname+"', agency_name = '"+agency_name+"', email = '"+email+"', logo = '"+logo+"', address = '"+address+"', city = '"+city+"', zip = '"+zip+"', state = '"+state+"', plan = '"+plan+"', status = '"+status+"'";
        if(password!="") {
            updateString += ", password = '"+password+"' ";
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
            message = "Agency Deactivated successfully";
        }
        if(status == 1){
            message = "Agency Activated successfully";
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

const deleteAgency = (request, callback) => {
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
    getAgencies,
    getActiveAgencies,
    createAgency,
    updateStatus,
    updateAgency,
    deleteAgency
}