document.addEventListener("DOMContentLoaded", function () {

    console.log("ReFind Authentication Loaded");

    const registerForm = document.getElementById("registerForm");

    const loginForm = document.getElementById("loginForm");

    // PASSWORD SHOW / HIDE

    document.querySelectorAll(".toggle-password")
    .forEach(button => {

        button.addEventListener("click", function () {

            const input = document.getElementById(
                this.dataset.target
            );

            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                this.textContent = "Hide";
            } else {
                input.type = "password";
                this.textContent = "Show";
            }

        });

    });


    // GET REGISTERED USERS

    function getUsers() {

        try {
            return JSON.parse(
                localStorage.getItem("refindDemoUsers")
            ) || [];
        } catch {
            return [];
        }

    }


    // REGISTRATION

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            console.log("Registration button clicked");

            const name = document.getElementById("fullName").value.trim();

            const email = document.getElementById("registerEmail").value.trim().toLowerCase();

            const password = document.getElementById("registerPassword").value;

            const confirmPassword = document.getElementById("confirmPassword").value;

            const message = document.getElementById("registerMessage");

            function error(text) {
                message.textContent = text;
                message.className = "message error";
            }

            if (!name || !email || !password || !confirmPassword) {
                error("Please fill all the fields.");
                return;
            }

            if (password.length < 6) {
                error("Password must contain at least 6 characters.");
                return;
            }

            if (password !== confirmPassword) {
                error("Passwords do not match.");
                return;
            }

            const users = getUsers();

            const existingUser = users.find(
                user => user.email === email
            );

            if (existingUser) {
                error("Email already registered. Please login.");
                return;
            }

            users.push({
                name: name,
                email: email,
                password: password
            });

            try {

                localStorage.setItem(
                    "refindDemoUsers",
                    JSON.stringify(users)
                );

                message.textContent =
                    "Registration successful! Redirecting to login...";

                message.className = "message success";

                registerForm.reset();

                setTimeout(function () {
                    window.location.href = "login.html";
                }, 1500);

            } catch (e) {

                error("Browser storage error. Please try again.");

                console.error(e);

            }

        });

    }


    // LOGIN

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const email = document.getElementById("loginEmail")
                .value.trim().toLowerCase();

            const password = document.getElementById("loginPassword")
                .value;

            const message = document.getElementById("loginMessage");

            const users = getUsers();

            // DEMO ADMIN ACCOUNT (change these before showing others)
            const ADMIN_EMAIL = "admin@refind.com";
            const ADMIN_PASSWORD = "admin123";

            let user = users.find(
                account =>
                    account.email === email &&
                    account.password === password
            );

            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                user = { name: "Admin", email: ADMIN_EMAIL, role: "admin" };
            }

            if (!user) {

                message.textContent =
                    "Invalid email or password.";

                message.className = "message error";

                return;
            }

            localStorage.setItem(
                "refindDemoSession",
                JSON.stringify({
                    name: user.name,
                    email: user.email,
                    role: user.role || "user"
                })
            );

            message.textContent = "Login successful!";

            message.className = "message success";

            setTimeout(function () {
                window.location.href =
                    user.role === "admin" ? "admin.html" : "index.html";
            }, 1000);

        });

    }

});