var namespaces = require("../data/namespaces");
var User = require("../models/User");
var fs = require("fs");
var RoomMessages = require("../models/RoomMessage");
var connections = require("../connections.json");
var jsonFile = JSON.parse(fs.readFileSync("connections.json", "utf8"));

module.exports = function(io) {
  var admin = io.of("/admin");
  var user = io.of("/user");
  var namespaces = { user_endpoint: "/user", admin_endpoint: "/admin" };

  // upon connection send all rooms avaiilable to the current user
  user.on("connection", nsSocket => {
    console.log("new socket connected to user");    
    var user_id = nsSocket.handshake.query.id;
    userModel = new User();
    if (user_id) {
      userModel.loadRooms(user_id, function(error, response) {
        if (!error) {
          nsSocket.emit("nsRoomList", response.rooms);
        } else {
          nsSocket.emit("nsRoomList", response.rooms);
        }
      });
    } else {
      nsSocket.emit("nsRoomList", []);
    }

    // console.log(`${nsSocket.id} has join ${namespace.endpoint}`)
    // a socket has connected to one of our chatgroup namespaces.
    // send that ns gorup info back

    nsSocket.on("joinRoom", (roomToJoin, numberOfUsersCallback) => {
      console.log(`request to join room.. ${roomToJoin}`);
      // deal with history... once we have it
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom("/", roomToLeave, io);
      nsSocket.join(roomToJoin);

      // getting the history of the room to join
      RoomMessages.getHistory({ roomId: roomToJoin }, function(err, results) {
        if (!err) {
          nsSocket.emit("historyCatchUp", results);
          updateUsersInRoom(namespaces.user_endpoint, roomToJoin, io);
        } else {
          nsSocket.emit("historyCatchUp", []);
          updateUsersInRoom(namespaces.user_endpoint, roomToJoin, io);
        }
      });
      updateUsersInRoom(namespaces.user_endpoint, roomToJoin, io);
    });

    nsSocket.on("newMessageToServer", msg => {
      // Send this message to ALL the sockets that are in the room that THIS socket is in.
      // how can we find out what rooms THIS socket is in?
      // console.log(nsSocket.rooms)
      // the user will be in the 2nd room in the object list
      // this is because the socket ALWAYS joins its own room on connection
      // get the keys
      var roomId = Object.keys(nsSocket.rooms)[1];
      var fullMsg = {
        roomId: roomId,
        message: msg.text,
        senderId: msg.senderId,
        created_date: Date.now(),
        status: 1,
        type: msg.type ? msg.type : 1
      };
      console.log(fullMsg);
      RoomMessages.addMessage(fullMsg, function(err, response) {
        if (!err) {
          user.to(roomId).emit("messageToClients", response);
        } else {
          user.to(roomId).emit("messageToClientsError", fullMsg);
        }
      });
    });

    nsSocket.on("fileUpload", function(data){
    })

  });
};

function updateUsersInRoom(namespace, roomToJoin, io) {
  // Send back the number of users in this room to ALL sockets connected to this room
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients((error, clients) => {
      // console.log(`There are ${clients.length} in this room`);
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .emit("updateMembers", clients.length);
    });
}
