
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("reportForm");
    const imageInput = document.getElementById("itemImage");
    const preview = document.getElementById("imagePreview");
    const previewText = document.getElementById("previewText");
    const message = document.getElementById("formMessage");
    const myReports = document.getElementById("myReports");

    let selectedImage = "";

    // No future dates
    document.getElementById("itemDate").max =
        new Date().toISOString().split("T")[0];

    // READ SAVED REPORTS

    function getItems() {
        try {
            return JSON.parse(
                localStorage.getItem("refindItems")
            ) || [];
        } catch {
            return [];
        }
    }

    // SELECT LOST OR FOUND

    document.querySelectorAll(".type-btn").forEach(button => {

        button.addEventListener("click", function () {

            document.querySelectorAll(".type-btn")
                .forEach(btn => btn.classList.remove("selected"));

            this.classList.add("selected");

            document.getElementById("itemType").value =
                this.dataset.type;

        });

    });

    // IMAGE PREVIEW

    imageInput.addEventListener("change", function () {

        const file = this.files[0];

        selectedImage = "";
        preview.removeAttribute("src");
        preview.style.display = "none";
        previewText.textContent = "Your image preview will appear here.";

        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            message.textContent = "Please select a JPG, PNG or WebP image.";
            message.className = "error";
            this.value = "";
            return;
        }

        if (file.size > 700 * 1024) {
            message.textContent = "Image must be smaller than 700 KB.";
            message.className = "error";
            this.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            selectedImage = event.target.result;

            preview.src = selectedImage;
            preview.style.display = "block";

            previewText.textContent = file.name;

            message.textContent = "";
        };

        reader.onerror = function () {
            message.textContent = "Could not read the image.";
            message.className = "error";
        };

        reader.readAsDataURL(file);

    });

    // SUBMIT REPORT

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const item = {

            id: Date.now().toString(),

            name: document.getElementById("itemName")
                .value.trim(),

            category: document.getElementById("category").value,

            type: document.getElementById("itemType").value,

            location: document.getElementById("location")
                .value.trim(),

            date: document.getElementById("itemDate").value,

            description: document.getElementById("description")
                .value.trim(),

            contactName: document.getElementById("contactName")
                .value.trim(),

            email: document.getElementById("contactEmail")
                .value.trim(),

            phone: document.getElementById("contactPhone")
                .value.trim(),

            image: selectedImage,

            status: "Pending",

            createdAt: new Date().toISOString()

        };

        const items = getItems();

        items.push(item);

        try {

            localStorage.setItem(
                "refindItems",
                JSON.stringify(items)
            );

            message.textContent =
                "Report submitted successfully! Thank you for using ReFind.";

            message.className = "success";

            form.reset();

            selectedImage = "";

            preview.removeAttribute("src");
            preview.style.display = "none";

            previewText.textContent =
                "Your image preview will appear here.";

            document.getElementById("itemType").value = "Lost";

            document.querySelectorAll(".type-btn")
                .forEach(btn => btn.classList.remove("selected"));

            document.querySelector(
                '[data-type="Lost"]'
            ).classList.add("selected");

            displayReports();

        } catch (error) {

            message.textContent =
                "Storage is full. Remove some images or use smaller photos.";

            message.className = "error";

            console.error(error);

        }

    });

    // DISPLAY RECENT REPORTS

    function displayReports() {

        const items = getItems();

        myReports.textContent = "";

        const recentItems = items.slice(-6).reverse();

        if (recentItems.length === 0) {

            myReports.textContent =
                "No reports submitted yet.";

            return;

        }

        recentItems.forEach(item => {

            const card = document.createElement("div");
            card.className = "report-item";

            if (item.image) {

                const img = document.createElement("img");
                img.src = item.image;
                img.alt = "Reported item";

                card.appendChild(img);

            }

            const title = document.createElement("h3");
            title.textContent = item.name;
            card.appendChild(title);

            const details = [
                "Type: " + item.type,
                "Category: " + item.category,
                "Location: " + item.location,
                "Status: " + item.status
            ];

            details.forEach(value => {

                const p = document.createElement("p");
                p.textContent = value;
                card.appendChild(p);

            });

            myReports.appendChild(card);

        });

    }

    // INITIAL DISPLAY

    displayReports();

});