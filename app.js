//var firebase = require("firebase/app");

// Add the Firebase products that you want to use
//require("firebase/auth");
//require("firebase/firestore");

// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCXRTprV0yWYk8YrVpopvkFM4Cv_Nmhb2g",
    authDomain: "shift-f80bc.firebaseapp.com",
    databaseURL: "https://shift-f80bc-default-rtdb.firebaseio.com",
    projectId: "shift-f80bc",
    storageBucket: "shift-f80bc.appspot.com",
    messagingSenderId: "111516463886",
    appId: "1:111516463886:web:f7ae7d49add43d4cc0dd5f",
    measurementId: "G-QXHD4RJNKQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

// 구글 인증 기능 추가
var provider = new firebase.auth.GoogleAuthProvider();
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

/*firebase.auth().signInWithRedirect(provider);
firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // ...
    	// The signed-in user info.
	  var user = result.user;
  
    window.location('auth.html');
	  console.log(user)		// 인증 후 어떤 데이터를 받아오는지 확인해보기 위함.
  }
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});*/

// 인증하기
firebase.auth().signInWithPopup(provider).then(function(result) {
	// This gives you a Google Access Token. You can use it to access the Google API.
	var token = result.credential.accessToken;
	// The signed-in user info.
	var user = result.user;
	
  console.log(user)		// 인증 후 어떤 데이터를 받아오는지 확인해보기 위함.
  window.location('auth.html');
// ...
}).catch(function(error) {
	// Handle Errors here.
	var errorCode = error.code;
	var errorMessage = error.message;
	// The email of the user's account used.
	var email = error.email;
	// The firebase.auth.AuthCredential type that was used.
	var credential = error.credential;
	// ...
});
