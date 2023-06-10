// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAK-6ezzc_1VUqpZwmAig9vsrIiXotuR0A",
    authDomain: "chatappweb-ee192.firebaseapp.com",
    projectId: "chatappweb-ee192",
    storageBucket: "chatappweb-ee192.appspot.com",
    messagingSenderId: "1085349594917",
    appId: "1:1085349594917:web:26aac40a2e492e1946bccc"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  


  // logout function
// ...

// Get DOM elements
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const logoutButton = document.getElementById('logout-button');

// Add send button click event listener
sendButton.addEventListener('click', () => {
  // Get the user's message
  const message = messageInput.value;

  // Implement the code to send the message to Firebase Firestore
  // ...

  // Clear the message input field
  messageInput.value = '';
});

// Add logout button click event listener
logoutButton.addEventListener('click', () => {
    console.log('Logout button clicked');
    firebase.auth().signOut()
      .then(() => {
        console.log('User signed out successfully');
        // Redirect to the login page or any other desired page
        window.location.href = 'login.html';
      })
      .catch((error) => {
        console.log('Sign-out error:', error);
      });
  });
  

// ...
