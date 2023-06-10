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
const auth = firebase.auth();
const firestore = firebase.firestore();

const signupContainer = document.getElementById('signup-container');
const errorMessage = document.getElementById('error-message');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const usernameInput = document.getElementById('username-input');
const signupButton = document.getElementById('signup-button');

signupButton.addEventListener('click', signUpUser);

// Function to sign up a user
function signUpUser() {
  const email = emailInput.value;
  const password = passwordInput.value;
  const username = usernameInput.value;

  // Check if username already exists
  firestore
    .collection('users')
    .where('username', '==', username)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        errorMessage.textContent = 'Username already exists.';
      } else {
        // Create user with email and password
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Save user details in Firestore
            return firestore.collection('users').doc(userCredential.user.uid).set({
              username: username,
              email: email,
            });
          })
          .then(() => {
            // Signup successful
            errorMessage.textContent = 'Signup successful!';
            window.location.href = 'homepage.html';
            // You can redirect the user to another page or perform additional actions here
          })
          .catch((error) => {
            // Handle signup errors
            errorMessage.textContent = error.message;
          });
      }
    })
    .catch((error) => {
      // Handle Firestore query errors
      errorMessage.textContent = error.message;
    });
}

