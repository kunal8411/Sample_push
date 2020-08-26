

module.exports.chatSockets= function(socketServer){

    let io= require('socket.io')(socketServer);

    io.sockets.on('connection',function(socket){
        console.log('new Connection received',socket.id);

        socket.on('disconnect',function(){
            console.log('Socket Disconnected');

        });

        //receives the join_room event from client to join the room with mentioned room name 
        socket.on('join_room',function(data){
            console.log('joining request received',data);

            //this will check if chat room with that name exist or not if yes then joined the
            // user to that room else,
            //create new room with thar name and join the user to that chat room 
            socket.join(data.chatRoom);

            //inform all members of that chat room that new user has joined our chat 
            io.in(data.chatRoom).emit('user_joined',data);

        });

        //detect send_message and broadcast to all the users in that char room 
        socket.on('send_message',function(data){
            io.in(data.chatRoom).emit('receive_message',data);

        });
        

    });
}