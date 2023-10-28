
let io 

function initializeSocket(server) {
    function initializeSocket(server) {
        io = require('socket.io')(server);
    
        io.on('connection', (socket) => {
            console.log('Client đã kết nối');
    
            // Xử lý khi máy khách tham gia vào một phòng với id là targetClientId
            socket.on('joinRoom', (targetClientId) => {
                socket.join(targetClientId);
                console.log(`Client đã tham gia vào phòng: ${targetClientId}`);
            });
    
            // Xử lý sự kiện và gửi chỉ đến các máy khách trong một phòng
            socket.on('sendToRoom', ({ targetClientId, data }) => {
                io.to(targetClientId).emit('someEvent', data);
            });
        });
    }
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



