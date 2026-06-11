import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCmciwmEbSDgA5PhCY12a_vKqXl4GDBeZ8",
    authDomain: "school-project-5fe93.firebaseapp.com",
    projectId: "school-project-5fe93",
    storageBucket: "school-project-5fe93.firebasestorage.app",
    messagingSenderId: "548925209782",
    appId: "1:548925209782:web:cea0aac7d41a510b2fba17",
    measurementId: "G-5MG8T54708"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// REGISTER PROCESS (ලියාපදිංචි වීම)
// ==========================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                
                // Firestore එකට "pending" විදිහට සේව් කරනවා
                await setDoc(doc(db, "users", user.uid), {
                    username: username,
                    email: email,
                    status: "pending" 
                });

                // Register වුණු ගමන් Auto-Login වෙන එක නවත්තන්න Logout කරනවා
                await signOut(auth);

                alert("Registration Successful! Please wait for Admin Approval.");
                window.location.href = "login.html"; 
            })
            .catch((error) => alert("Error: " + error.message));
    });
}

// ==========================================
// LOGIN PROCESS (ඇතුල් වීම)
// ==========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                // ඩේටාබේස් එකෙන් status එක බලනවා
                const userDoc = await getDoc(doc(db, "users", user.uid));
                
                if (userDoc.exists() && userDoc.data().status === "approved") {
                    alert("Login Successful!");
                    // 🔴 මෙතනදී කෙලින්ම home.html එකට යවනවා
                    window.location.href = "home.html"; 
                } else {
                    // Approved නැත්නම් මෙතනදීම Sign Out කරනවා
                    await signOut(auth);
                    alert("Access Denied: Your account is pending admin approval.");
                }
            })
            .catch((error) => alert("Error: " + error.message));
    });
}