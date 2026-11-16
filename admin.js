// ADMIN ONLY: send everyone else to the login page
(function () {
    let session = null;
    try {
        session = JSON.parse(localStorage.getItem("refindDemoSession"));
    } catch (error) {}

    if (!session || session.role !== "admin") {
        window.location.href = "login.html";
    }
})();

document.addEventListener("DOMContentLoaded", function () {

    // GET DATA FROM LOCAL STORAGE

    function getData(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    }

    let items = getData("refindItems");
    let users = getData("refindDemoUsers");

    const table = document.getElementById("reportTable");
    const search = document.getElementById("searchInput");
    const empty = document.getElementById("emptyMessage");


    // UPDATE STATISTICS

    function updateStats() {

        document.getElementById("totalItems").textContent =
            items.length;

        document.getElementById("lostItems").textContent =
            items.filter(item => item.type === "Lost").length;

        document.getElementById("foundItems").textContent =
            items.filter(item => item.type === "Found").length;

        document.getElementById("totalUsers").textContent =
            users.length;

    }


    // DISPLAY REPORTS

    function displayItems(filter = "") {

        table.textContent = "";

        const filteredItems = items.filter(item =>
            String(item.name || "").toLowerCase().includes(filter) ||
            String(item.category || "").toLowerCase().includes(filter) ||
            String(item.location || "").toLowerCase().includes(filter)
        );

        empty.style.display =
            filteredItems.length ? "none" : "block";

        filteredItems.forEach(item => {

            const tr = document.createElement("tr");

            const values = [
                item.name || "",
                item.category || "",
                item.type || "",
                item.location || ""
            ];

            values.forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });

            const statusCell = document.createElement("td");

            const status = document.createElement("span");
            status.className =
                item.status === "Recovered"
                    ? "status recovered"
                    : "status";

            status.textContent = item.status || "Pending";
            statusCell.appendChild(status);
            tr.appendChild(statusCell);

            const actionCell = document.createElement("td");

            if (item.status !== "Recovered") {

                const button = document.createElement("button");

                button.textContent = "Recovered";
                button.className = "action-btn";

                button.addEventListener("click", function () {

                    item.status = "Recovered";

                    localStorage.setItem(
                        "refindItems",
                        JSON.stringify(items)
                    );

                    displayItems(search.value.toLowerCase());
                });

                actionCell.appendChild(button);

            } else {
                actionCell.textContent = "Completed";
            }

            tr.appendChild(actionCell);
            table.appendChild(tr);

        });

    }


    // SEARCH

    search.addEventListener("input", function () {
        displayItems(this.value.toLowerCase());
    });


    // LOGOUT

    document.getElementById("logoutBtn")
    .addEventListener("click", function () {

        localStorage.removeItem("refindDemoSession");

        window.location.href = "login.html";

    });


    updateStats();
    displayItems();

});
