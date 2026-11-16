// SHARED HELPERS (used on every page)
// Load this file BEFORE the page's own script.

function getSession() {
    try {
        return JSON.parse(localStorage.getItem("refindDemoSession"));
    } catch (error) {
        return null;
    }
}

function isAdmin() {
    const session = getSession();
    return !!session && session.role === "admin";
}

document.addEventListener("DOMContentLoaded", function () {

    // Show admin-only links ONLY to the admin
    document.querySelectorAll(".admin-only").forEach(function (el) {
        el.hidden = !isAdmin();
    });

    // Navbar: show name + Logout when someone is logged in
    const session = getSession();
    const navButtons = document.querySelector(".nav-buttons");

    if (session && navButtons) {

        navButtons.textContent = "";

        const welcome = document.createElement("span");
        welcome.className = "welcome-user";
        welcome.textContent = "Hi, " + session.name;

        const logout = document.createElement("a");
        logout.href = "#";
        logout.className = "login-btn";
        logout.textContent = "Logout";

        logout.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("refindDemoSession");
            window.location.href = "index.html";
        });

        navButtons.append(welcome, logout);
    }

});
