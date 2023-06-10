const firebaseConfig = {
  apiKey: "AIzaSyAK-6ezzc_1VUqpZwmAig9vsrIiXotuR0A",
  authDomain: "chatappweb-ee192.firebaseapp.com",
  projectId: "chatappweb-ee192",
  storageBucket: "chatappweb-ee192.appspot.com",
  messagingSenderId: "1085349594917",
  appId: "1:1085349594917:web:26aac40a2e492e1946bccc"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

var chatListItems = document.getElementById('chat-list-items');
var chatWindow = document.getElementById('chat-window');
var chatMessages = document.getElementById('chat-messages');
var messageInput = document.getElementById('message-input');
var sendButton = document.getElementById('send-button');

// Assuming 'users' is the reference to your Firestore collection containing user information
firebase.firestore().collection('users').get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    var username = doc.data().username;
    var profilePic = doc.data().profilePic;

    // Create a chat list item
    var listItem = document.createElement('li');
    listItem.className = 'chat-list-item';

    // Create the profile picture element
    var profilePicElement = document.createElement('img');
    profilePicElement.className = 'profile-pic';
    profilePicElement.alt = 'Profile Picture';

    // Check if profile picture exists
    if (profilePic) {
      profilePicElement.src = profilePic;
    } else {
      // Set default profile picture
      profilePicElement.src = 'default-profile-pic.jpg'; // Replace with your default profile picture URL
    }

    listItem.appendChild(profilePicElement);

    // Create the username element
    var usernameElement = document.createElement('span');
    usernameElement.textContent = username;
    listItem.appendChild(usernameElement);

    // Add an event listener to handle click on the chat list item
    listItem.addEventListener('click', function() {
      // Clear chat messages
      chatMessages.innerHTML = '';

      // Show the chat window
      chatWindow.style.display = 'block';

      // Set the title of the chat window to the selected user's name
      var selectedUsername = this.querySelector('span').textContent;
      chatWindow.querySelector('.chat-window-title').textContent = selectedUsername;

      // Implement the logic to load and display the chat messages for the selected user
      var currentUser = firebase.auth().currentUser;
      if (currentUser) {
        // Retrieve the username of the logged-in user from the 'users' collection
        firebase.firestore().collection('users').doc(currentUser.uid).get().then((doc) => {
          if (doc.exists) {
            var currentUsername = doc.data().username;
            loadChatMessages(selectedUsername, currentUsername);
          }
        }).catch((error) => {
          console.log('Error retrieving user information:', error);
        });
      } else {
        // Handle the case when the user is not authenticated
        console.log('User not authenticated');
      }
    });

    // Append the chat list item to the chat list
    chatListItems.appendChild(listItem);
  });
})
.catch((error) => {
  console.log('Error getting users:', error);
});

// Function to load chat messages between two users
function loadChatMessages(selectedUsername, currentUsername) {
  console.log('Selected Username:', selectedUsername); // Check the value of selectedUsername
  console.log('Logged In Username:', currentUsername); // Check the value of currentUsername
  
  var chatMessagesContainer = document.getElementById('chat-messages'); // Get the chat messages container element
  
  // Assuming 'messages' is the reference to your Firestore collection containing chat messages
  firebase.firestore().collection('messages')
    .where('participants', 'in', [[currentUsername, selectedUsername], [selectedUsername, currentUsername]])
    .orderBy('timestamp') // Sort messages by timestamp in ascending order
    .onSnapshot((querySnapshot) => {
      console.log('Query Snapshot:', querySnapshot); // Check the query snapshot data

      // Clear existing messages
      chatMessagesContainer.innerHTML = '';

      querySnapshot.forEach((doc) => {
        console.log('Document:', doc); // Check each document data

        var message = doc.data().message;
        var sender = doc.data().sender;
        var participants = doc.data().participants;

        // Create a message element
        var messageElement = document.createElement('div');
        messageElement.className = 'message';

        if (sender === currentUsername) {
          messageElement.classList.add('sender-message');
        } else {
          messageElement.classList.add('received-message');
        }

        var senderNameElement = document.createElement('div');
        senderNameElement.className = 'sender-name';
        senderNameElement.textContent = sender;

        var messageContentElement = document.createElement('div');
        messageContentElement.className = 'message-content';
        messageContentElement.textContent = message;

        // Append the sender name and message content to the message element
        messageElement.appendChild(senderNameElement);
        messageElement.appendChild(messageContentElement);

        // Append the message element to the chat messages container
        chatMessagesContainer.appendChild(messageElement);
      });
    }, (error) => {
      console.log('Error loading chat messages:', error);
    });
}




var logoutButton = document.getElementById('logout-button');

// Event listener for the logout button
logoutButton.addEventListener('click', function() {
  firebase.auth().signOut().then(function() {
    // Redirect to login page after successful logout
    window.location.href = 'login.html';
  }).catch(function(error) {
    console.log('Error logging out:', error);
  });
});

// Event listener for the send button
sendButton.addEventListener('click', function() {
  var message = messageInput.value.trim();
  var selectedUsername = chatWindow.querySelector('.chat-window-title').textContent;

  // Get the current user
  var currentUser = firebase.auth().currentUser;

  if (currentUser) {
    var currentUsername = '';
    
    // Retrieve the username of the logged-in user from the 'users' collection
    firebase.firestore().collection('users').doc(currentUser.uid).get().then((doc) => {
      if (doc.exists) {
        currentUsername = doc.data().username;
        firebase.firestore().collection('messages').add({
          message: message,
          sender: currentUsername,
          participants: [currentUsername, selectedUsername],
          timestamp: firebase.firestore.FieldValue.serverTimestamp() // Add the timestamp field with the server timestamp value
        }).then(() => {
          // Clear the message input
          messageInput.value = '';
          loadChatMessages(selectedUsername, currentUsername);
        }).catch((error) => {
          console.log('Error sending message:', error);
        });
      }
    }).catch((error) => {
      console.log('Error retrieving user information:', error);
    });
  } else {
    // Handle the case when the user is not authenticated
    console.log('User not authenticated');
  }
});

