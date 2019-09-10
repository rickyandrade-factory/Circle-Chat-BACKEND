var fs = require('fs');
var connections = require('../connections.json');

var jsonFile = JSON.parse(fs.readFileSync('connections.json', 'utf8'));

var User = {

    login: function(post, callback){
        if(jsonFile.hasOwnProperty(post.username)){
            if(jsonFile[post.username] && jsonFile[post.username].pwd == post.password){
                callback({success: 1, data: jsonFile[post.username].userData});
            }else{
                callback({error: 1, message: "Incorrect Password !"})
            }
        }else{
            callback({error: 1, message: "User does not exist."})
        }
    },
}


module.exports = User;
