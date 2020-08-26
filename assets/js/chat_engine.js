class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox= $(`#${chatBoxId}`);
        this.userEmail= userEmail;

        this.socket=io.connect('http://localhost:5000');

        if(this.userEmail){
            this.connectionHandler();

        }
    }
    //on-->used to detect an event(connect) 
    //acknowlwdge has been send from server to this function and if connection estableshed this function will gets called 
    connectionHandler(){

        let self= this;

        this.socket.on('connect',function(){
            console.log('Connection established using Sockets....!');

            //when we connect ask to join room 
            //send request to join the room alongside some data with that request 
            self.socket.emit('join_room',{
                user_email:self.userEmail,
                chatRoom:'codeail'
            });

            //receives ack from server with event name user_joined
            self.socket.on('user_joined',function(data){
                console.log('a user joined',data);

            });



        });
        //send a message on clicking the send button
        $(`#send-message`).click(function(){
            let msg= $('#chat-message-input').val();
            
            if(msg!=''){
                self.socket.emit('send_message',{
                    message:msg,
                    user_email:self.userEmail,
                    chatRoom:'codeail'
                })
            }
        });

        self.socket.on('receive_message',function(data){
            console.log('message received',data.message);

            let newMessage= $('<li>');
            
            let messageType= 'other-messsage';

            if(data.user_email == self.userEmail){
                messageType= 'self-messsage';
            }

            newMessage.append($('<span>',{
                'html': data.message

            }));

            newMessage.append($('<sub>',{
                'html':data.user_email
            }))

            newMessage.addClass(messageType);

            $('#chat-messsage-list').append(newMessage);


        })
        

    }
}