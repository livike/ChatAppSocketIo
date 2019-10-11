const messageTypes = {LEFT: 'left', RIGHT: 'right'};

//Chat DOM
let chatWindow = document.getElementById('chat');
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const submitBtn = document.getElementById('submitBtn');
const usernameInput = document.getElementById('usernameInput');

 const messages = [];

 // Socket.io functions
 var socket = io('http://35.157.80.184:8080');

 socket.on('message', message => {
  console.log('socket', socket);

   console.log('socket.on', message);
   setUsername();
   if (message.user === username) {
     message.type = messageTypes.RIGHT; 
   } else {
     message.type = messageTypes.LEFT;
   }
   messages.push(message);
   displayMessages();
   chatWindow.scrollTop = chatWindow.scrollHeight;
 });

 const sendMessage = message => {
  socket.emit('message', message);
};

 // Common functions
 const setUsername = (arg) => {
  if (!usernameInput.value && arg === 'submit') {
    username = 'Guest';
    usernameInput.value = 'Guest';
    // console.log('default username will be', username);
  } else {
    username = usernameInput.value;
    // console.log('set the userame to ',username);
  }
};

// Message creation
const createMessageHTML = message => {
  return`
  <div class='message flex-column ${message.type === messageTypes.LEFT ? 'message-left' : 'message-right'}'>
     <span class="message-content">${message.type === messageTypes.RIGHT ? '' :  message.user + ': '} ${message.message} </span>
  </div>
  `
};

const displayMessages = () => {
  const messagesHTML = messages
  .map(message => createMessageHTML(message))
  .join('');

  messagesList.innerHTML = messagesHTML;
};

// setting the username
usernameInput.addEventListener( 'input', e => {
  // e.preventDefault();
  setUsername();
});

// submitBtn callback
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  setUsername('submit');

  if (!messageInput.value) {
    console.log('please supply a message');
  } else {
    const message = {
      user:username,
      message: messageInput.value,
      type: messageTypes.RIGHT
    }

    sendMessage(message);

    messageInput.value = '';
  }
});
