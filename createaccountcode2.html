<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FridgeWise - Confirm Verification</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
</head>
<body class="bg-[#f0fff4] font-sans antialiased text-gray-900">

    <div class="flex flex-col min-h-screen">
        <header class="bg-[#dcfce7] border-b border-green-200 shadow-sm sticky top-0 z-50">
            <nav class="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between">
                <div class="flex items-center">
                    <a href="createaccountcode.html" class="text-gray-600 hover:text-gray-900 p-2 transition-colors">
                        <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                    </a>
                    <div class="h-8 border-l border-green-300 mx-4"></div>
                    <span class="font-bold text-green-800 text-xl uppercase tracking-tighter">FridgeWise</span>
                </div>
            </nav>
        </header>

        <main class="flex-grow flex items-center justify-center py-12 px-4">
            <div class="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-green-100 text-center">
                <h1 class="text-3xl font-bold text-gray-800 mb-3 uppercase italic tracking-tighter">Enter Code</h1>
                <p class="text-sm text-gray-500 mb-8 leading-relaxed">Please enter the 6-digit verification code sent to your email.</p>
                
                <div class="space-y-6">
                    <input type="text" id="userInputCode" maxlength="6" placeholder="000000" 
                           class="w-full text-center text-4xl font-mono tracking-[0.5em] bg-gray-50 border-2 border-gray-100 rounded-2xl py-5 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all">
                    
                    <button id="verifyBtn" class="w-full bg-green-600 text-white font-bold py-4 rounded-2xl uppercase tracking-[0.15em] hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95 text-sm">
                        VERIFY & CREATE ACCOUNT
                    </button>
                </div>

                <div class="mt-10 flex items-center justify-center gap-3">
                    <div class="flex gap-1.5">
                        <span class="h-1.5 w-8 bg-green-500 rounded-full"></span>
                        <span class="h-1.5 w-8 bg-green-500 rounded-full"></span>
                    </div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2">Step 2 of 2</p>
                </div>
            </div>
        </main>
    </div>

    <script>
        // 1. Firebase Config
        const firebaseConfig = {
            apiKey: "AIzaSyAZl_HJXjKdycYfYfb4rH7Pue6vwJ9G-KM",
            authDomain: "fridgewise-37166.firebaseapp.com",
            projectId: "fridgewise-37166",
            storageBucket: "fridgewise-37166.firebasestorage.app",
            messagingSenderId: "367251387454",
            appId: "1:367251387454:web:ed536522f271197b3d0d6f"
        };
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const db = firebase.database();

        const verifyBtn = document.getElementById('verifyBtn');
        const userInput = document.getElementById('userInputCode');

        verifyBtn.addEventListener('click', async () => {
            const enteredCode = userInput.value.trim();
            const savedCode = localStorage.getItem('regVerifyCode');
            const pendingData = sessionStorage.getItem('pendingUser');

            // Verification Logic
            if (!pendingData) {
                alert("Registration data not found. Please go back to the Sign Up page.");
                window.location.href = "register.html";
                return;
            }

            const pendingUser = JSON.parse(pendingData);

            if (enteredCode !== savedCode) {
                alert("Incorrect verification code. Please check your email again.");
                return;
            }

            // CHECKING THE 'PASS' KEY (Matches your register.html screenshot)
            if (!pendingUser.pass || pendingUser.pass.trim() === "") {
                alert("Error: Password data is missing. Please restart the sign-up process.");
                console.error("Missing password in:", pendingUser);
                return;
            }

            verifyBtn.innerText = "CREATING ACCOUNT...";
            verifyBtn.disabled = true;

            try {
                // 1. Create User in Firebase Auth using 'pass'
                const userCredential = await auth.createUserWithEmailAndPassword(pendingUser.email, pendingUser.pass);
                const user = userCredential.user;

                // 2. Save User Data to Database
                await db.ref('users/' + user.uid).set({
                    username: pendingUser.username,
                    email: pendingUser.email,
                    dob: pendingUser.dob,
                    pass: pendingUser.pass, // Kept as 'pass' to match your Prof's suggested sync style
                    createdAt: new Date().toISOString()
                });

                // 3. Cleanup
                localStorage.removeItem('regVerifyCode');
                sessionStorage.removeItem('pendingUser');
                
                alert("Account created successfully! Welcome to FridgeWise.");
                window.location.href = "index.html";

            } catch (error) {
                console.error("Firebase Creation Error:", error);
                alert("Error: " + error.message);
                verifyBtn.innerText = "VERIFY & CREATE ACCOUNT";
                verifyBtn.disabled = false;
            }
        });
    </script>
</body>
</html>