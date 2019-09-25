class Room{
    constructor(roomId, roomUsername, roomTitle, namespace, privateRoom = false){
        this.roomId = roomId;
        this.roomUsername = roomUsername;
        this.roomTitle = roomTitle;
        this.namespace = namespace;
        this.privateRoom = privateRoom;
        this.history = [];
    }
    addMessage(message){
        this.history.push(message);
    }
    clearHistory(){
        this.history = [];
    }
}

module.exports = Room;