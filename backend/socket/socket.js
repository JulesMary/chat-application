const token = require('./../security/token');
const chatroomService = require('./../services/chatroomService');

const socket = (server) => {
    let userId = 0;
    let connections = [];

    const io = require('socket.io')(server);

    io.set('origins', 'localhost:*');

    io.sockets.on('connection', function(socket) {
        connections.push(socket);
        userId += 1;
        socket.emit('start', { userId });
        socket.on('message', (data) => messageService(data, connections));

        socket.on('disconnect', () => disconnectService(connections));
    });

    return io;
};

const messageService = async (data, connections) => {
    const user = await token.verify(data.token);
    const chatroom = data.chatroom;

    //store message to chat
    chatroomService
        .storeMessageToChatroom(data.message, data.user, chatroom)
        .then((result) => {})
        .catch((err) => console.warn(err));

    connections.forEach((connectedSocket) => {
        if (connectedSocket !== socket) {
            connectedSocket.emit('message', {
                message: data.message,
                user: data.user,
            });
        }
    });
};

const disconnectService = (connections) => {
    const index = connections.indexOf(socket);
    connections.splice(index, 1);
};

module.exports = socket;