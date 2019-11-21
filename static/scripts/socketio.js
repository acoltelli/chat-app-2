document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    const username = document.querySelector('#get-username').innerHTML;
    // Default room
    let room = "General"
    joinRoom("General");

    document.querySelector('#send_message').onclick = () => {
        socket.emit('incoming-msg', {'msg': document.querySelector('#user_message').value,
            'username': username, 'room': room});
        document.querySelector('#user_message').value = '';
    };

    // Display all incoming messages
    socket.on('message', data => {
        // Display current message
        if (data.msg) {
            const p = document.createElement('p');
            const span_username = document.createElement('span');
            const span_timestamp = document.createElement('span');
            const br = document.createElement('br')
            // Display user's msg
            if (data.username == username) {
                    p.setAttribute("class", "my-msg");
                    span_username.setAttribute("class", "my-username");
                    span_username.innerText = data.username;
                    span_timestamp.setAttribute("class", "timestamp");
                    span_timestamp.innerText = data.time_stamp;
                    p.innerHTML += span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML
                    document.querySelector('#display-message-section').append(p);
            }
            // Display other's msg
            else if (typeof data.username !== 'undefined') {
                p.setAttribute("class", "others-msg");
                span_username.setAttribute("class", "other-username");
                span_username.innerText = data.username;
                span_timestamp.setAttribute("class", "timestamp");
                span_timestamp.innerText = data.time_stamp;
                p.innerHTML += span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML;
                document.querySelector('#display-message-section').append(p);
            }
            else {
                printSysMsg(data.msg);
            }
        }
        scrollDownChatWindow();
    });

    // Toggle room logic
    // TODO: have newroom equal home input
    document.querySelectorAll('.select-room').forEach(p => {
        p.onclick = () => {
            let newRoom = p.innerHTML
            if (newRoom === room) {
                msg = `You are already in ${room} room.`;
                printSysMsg(msg);
            } else {
                leaveRoom(room);
                joinRoom(newRoom);
                room = newRoom;
            }
        };
    });

    // Logout user
    document.querySelector("#logout-btn").onclick = () => {
        leaveRoom(room);
    };

    // Trigger leave event from room
    function leaveRoom(room) {
        socket.emit('leave', {'username': username, 'room': room});
        document.querySelectorAll('.select-room').forEach(p => {
            p.style.color = "black";
        });
    }

    function joinRoom(room) {
        socket.emit('join', {'username': username, 'room': room});
        document.querySelector('#' + CSS.escape(room)).style.color = "#83B1FF";
        document.querySelector('#' + CSS.escape(room)).style.backgroundColor = "white";
        // Clear message area
        document.querySelector('#display-message-section').innerHTML = '';
        // Autofocus on text box
        document.querySelector("#user_message").focus();
    }

    function scrollDownChatWindow() {
        const chatWindow = document.querySelector("#display-message-section");
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function printSysMsg(msg) {
        const p = document.createElement('p');
        p.setAttribute("class", "system-msg");
        p.innerHTML = msg;
        document.querySelector('#display-message-section').append(p);
        scrollDownChatWindow()
        document.querySelector("#user_message").focus();
    }
});

// sidebar collapse
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#show-sidebar-button').onclick = () => {
        document.querySelector('#sidebar').classList.toggle('view-sidebar');
    };
    let msg = document.getElementById("user_message");
    msg.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("send_message").click();
        }
    });
});
