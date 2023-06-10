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

const loginContainer = document.getElementById('login-container');
const errorMessage = document.getElementById('error-message');
const usernameInput = document.getElementById('username-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', loginUser);

// Function to log in a user
function loginUser() {
  const email = emailInput.value;
  const password = passwordInput.value;
  const username = usernameInput.value;

  // Sign in with email and password
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      // Check if username exists for the logged-in user
      const currentUser = auth.currentUser;
      return firestore.collection('users').doc(currentUser.uid).get();
    })
    .then((doc) => {
      const user = doc.data();
      if (user && user.username === username) {
        // Login successful
        errorMessage.textContent = 'Login successful!';
        // Redirect to the chat page
        window.location.href = 'homepage.html';
      } else {
        // Username mismatch or user not found
        errorMessage.textContent = 'Invalid username or email/password.';
      }
    })
    .catch((error) => {
      // Handle login errors
      errorMessage.textContent = error.message;
    });
}
// ...

// ...
// ...

// ...

// ...

// ...

const googleLoginButton = document.getElementById('google-login-button');

googleLoginButton.addEventListener('click', loginWithGoogle);

// Function to log in with Google
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {
      // Get the user's email address
      const email = result.user.email;

      // Extract the Gmail ID (username) from the email address
      const username = email.substring(0, email.indexOf('@gmail.com'));

      // Check if the username exists in the Firestore collection
      return firestore.collection('users').where('email', '==', email).get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            // User already exists in the collection, use the existing username for login
            const userData = querySnapshot.docs[0].data();
            const existingUsername = userData.username;
            return Promise.resolve(existingUsername);
          } else {
            // Generate a unique username by appending a permutation of numbers
            const uniqueUsername = generateUniqueUsername(username);

            // Save the username and email in the Firestore collection
            const currentUser = result.user;
            return firestore.collection('users').doc(currentUser.uid).set({
              username: uniqueUsername,
              email: email
            })
              .then(() => uniqueUsername);
          }
        });
    })
    .then((username) => {
      // Login successful
      errorMessage.textContent = 'Login successful!';
      // Redirect to the chat page
      window.location.href = 'homepage.html';
    })
    .catch((error) => {
      // Handle login errors
      errorMessage.textContent = error.message;
    });
}

// Helper function to generate a unique username by appending a permutation of numbers
function generateUniqueUsername(username) {
  let uniqueUsername = username;
  const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
  uniqueUsername += randomNumber.toString();
  return uniqueUsername;
}









