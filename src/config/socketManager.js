
let io 

function initializeSocket(server) {
    io = require('socket.io')(server) 

    io.on('connection', (socket) => {
        console.log('Client đã kết nối') 
    }) 
}

function getIo() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized.') 
    }
    return io 
}

module.exports = {
    initializeSocket,
    getIo,
} 
