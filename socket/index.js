module.exports = function(io) {
  io.on("connect", function(socket) {
    console.log("new socket connected");
  });

  var traders = io.of("/traders-lounge");
  var market = io.of("/market-analysis");
  var customers = io.of("/customers");
  var dev = io.of("/dev-chat");
  var golden = io.of("/golden-circle");
  traders.on("connection", function(sock) {
    console.log("connected to traders socket");
  });
  market.on("connection", function(sock) {
    console.log("connected to market socket");
  });
  customers.on("connection", function(sock) {
    console.log("connected to customers socket");
  });
  dev.on("connection", function(sock) {
    console.log("connected to dev socket");
  });
  golden.on("connection", function(sock) {
    console.log("connected to golden socket");
  });

  traders.on("new_message", function(sock) {
    traders.emit("new_message", traders);
    console.log("connected to traders socket");
  });
  market.on("new_message", function(sock) {
    market.emit("new_message", traders);

    console.log("connected to market socket");
  });
  customers.on("new_message", function(sock) {
    customers.emit("new_message", traders);

    console.log("connected to customers socket");
  });
  dev.on("new_message", function(sock) {
    dev.emit("new_message", traders);
    console.log("connected to dev socket");
  });
  golden.on("new_message", function(sock) {
    golden.emit("new_message", traders);
    console.log("connected to golden socket");
  });

  io.use(function(socket, next) {
    if (
      typeof socket.handshake.query != "undefined" &&
      typeof socket.handshake.query.lang != "undefined"
    ) {
      var joinServerParameters = JSON.parse(
        socket.handshake.query.joinServerParameters
      );
    }
    next();
  });
};
