
// LOAD SAVED ITEMS

let items = [];

try {
    items = JSON.parse(
        localStorage.getItem("refindItems")
    ) || [];
} catch (error) {
    items = [];
}


// SAMPLE ITEMS

if (items.length === 0) {

    items = [
        {
            name: "College ID Card",
            type: "Lost",
            category: "Documents",
            location: "College Library",
            date: "2026-11-05",
            contact: "student@example.com",
            description: "Blue college identity card",
            image: ""
        },

        {
            name: "Black Water Bottle",
            type: "Found",
            category: "Accessories",
            location: "College Canteen",
            date: "2026-11-06",
            contact: "student@example.com",
            description: "Black water bottle found",
            image: ""
        },

        {
            name: "Wireless Earbuds",
            type: "Lost",
            category: "Electronics",
            location: "Classroom",
            date: "2026-11-07",
            contact: "student@example.com",
            description: "White wireless earbuds",
            image: ""
        }
    ];

    saveItems();
}


// SAVE ITEMS

function saveItems() {

    try {
        localStorage.setItem(
            "refindItems",
            JSON.stringify(items)
        );
    } catch (error) {
        alert("Storage full. Try removing some images.");
    }
}


// DISPLAY ITEMS

const grid = document.getElementById("itemsGrid");

function displayItems(data) {

    grid.innerHTML = "";

    if (data.length === 0) {

        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No items found.";

        grid.appendChild(message);
        return;
    }

    data.forEach(item => {

        const card = document.createElement("div");
        card.className = "item-card";

        // Photo or placeholder (same size for every card)
        if (item.image) {

            const image = document.createElement("img");
            image.src = item.image;
            image.alt = item.name;
            card.appendChild(image);

        } else {

            const placeholder = document.createElement("div");
            placeholder.className = "item-placeholder";
            placeholder.textContent = "📦";
            card.appendChild(placeholder);
        }

        // Badge: Lost / Found / Recovered
        const status = document.createElement("span");

        if (item.status === "Recovered") {
            status.className = "status recovered";
            status.textContent = "Recovered";
        } else {
            status.className = "status " +
                (item.type === "Lost" ? "lost" : "found");
            status.textContent = item.type;
        }

        const title = document.createElement("h3");
        title.textContent = item.name;

        const category = document.createElement("p");
        category.textContent = "Category: " + item.category;

        const location = document.createElement("p");
        location.textContent = "Location: " + item.location;

        const date = document.createElement("p");
        date.textContent = "Date: " + item.date;

        const description = document.createElement("p");
        description.textContent = item.description;

        // Contact button (works for old and new report formats)
        const contactText = [
            item.contactName,
            item.email || item.contact,
            item.phone
        ].filter(Boolean).join(" | ");

        const contactBtn = document.createElement("button");
        contactBtn.className = "contact-btn";
        contactBtn.textContent = item.type === "Lost"
            ? "I Found This"
            : "This Is Mine";

        const contactInfo = document.createElement("p");
        contactInfo.className = "contact-info";
        contactInfo.textContent = "Contact: " + (contactText || "Not provided");
        contactInfo.hidden = true;

        contactBtn.addEventListener("click", function () {
            contactInfo.hidden = !contactInfo.hidden;
        });

        card.append(
            status,
            title,
            category,
            location,
            date,
            description,
            contactBtn,
            contactInfo
        );

        grid.appendChild(card);

    });
}


// FILTER ITEMS

function filterItems(type, button) {

    document.querySelectorAll(".filter-btn")
        .forEach(btn => btn.classList.remove("active"));

    if (button) {
        button.classList.add("active");
    }

    if (type === "All") {
        displayItems(items);
    } else {
        displayItems(
            items.filter(item => item.type === type)
        );
    }
}


// SEARCH ITEMS

function searchItems() {

    const query = document
        .getElementById("searchInput")
        .value.toLowerCase()
        .trim();

    const results = items.filter(item => {

        return (
            item.name.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query) ||
            String(item.description || "").toLowerCase().includes(query)
        );

    });

    document.querySelectorAll(".filter-btn")
        .forEach(btn => btn.classList.remove("active"));

    displayItems(results);

    document.getElementById("items")
        .scrollIntoView({ behavior: "smooth" });
}


// INITIAL DISPLAY

displayItems(items);


// PRESS ENTER TO SEARCH

document.getElementById("searchInput")
    .addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            searchItems();
        }

    });
