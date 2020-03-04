import firebase from "firebase";
/*<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.9.3/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->

<script>*/
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBOunfLBhX2SMH0rFgOPwaBpax1L1iFAY0",
    authDomain: "cwu-parking-application.firebaseapp.com",
    databaseURL: "https://cwu-parking-application.firebaseio.com",
    projectId: "cwu-parking-application",
    storageBucket: "cwu-parking-application.appspot.com",
    messagingSenderId: "548233333184",
    appId: "1:548233333184:web:567764749fe8117a14e025"
};
// Initialize Firebase
var fire = firebase.initializeApp(firebaseConfig);
export default fire;
//</script>