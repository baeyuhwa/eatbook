let db;
const dbName = "recipesDatabase";
const storeName = "recipes";

const openDBRequest = indexedDB.open(dbName, 1);

openDBRequest.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
    }
};

openDBRequest.onsuccess = function(event) {
    db = event.target.result;
    console.log("IndexedDB opened successfully.");
};

openDBRequest.onerror = function(event) {
    console.error("Failed to open IndexedDB:", event.target.errorCode);
};

function createQRCode() {
    const recipeName = document.getElementById("recipeName").value;
    const ingredients = document.getElementById("ingredients").value;
    const category = document.getElementById("category").value;
    const summary = document.getElementById("summary").value;
    const process = document.getElementById("process").value;
    const photoFile = document.getElementById("photo").files[0];

    // Store recipe in IndexedDB
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    const recipe = {
        name: recipeName,
        ingredients: ingredients.split("\n"),
        category: category,
        summary: summary,
        processes: process.split("\n"),
        photo: null // Image data will be stored here as Blob
    };

    const addRequest = store.add(recipe);

    addRequest.onsuccess = function(event) {
        console.log("Recipe added to IndexedDB:", event.target.result);
        const recipeId = event.target.result;

        // Process photo data
        if (photoFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const photoDataUrl = event.target.result;
                recipe.photo = photoDataUrl;

                // Generate QR Code
                generateQRCode(recipeId, recipe);
            };
            reader.readAsDataURL(photoFile);
        } else {
            // Generate QR Code even if there's no photo
            generateQRCode(recipeId, recipe);
        }
    };

    addRequest.onerror = function(event) {
        console.error("Failed to add recipe to IndexedDB:", event.target.error);
    };
}

function generateQRCode(recipeId, recipe) {
    // Generate QR Code
    const qrCodeContainer = document.getElementById("qrcode");
    qrCodeContainer.innerHTML = ''; // Clear previous QR code
    new QRCode(qrCodeContainer, {
        text: `${window.location.origin}/view_recipe.html?id=${recipeId}`,
        width: 200,
        height: 200
    });

    // Display scanned recipe information below QR code
    displayScannedRecipe(recipe);
}

function displayScannedRecipe(recipe) {
    document.getElementById("recipeNameDisplay").textContent = recipe.name;
    document.getElementById("recipePhotoDisplay").src = recipe.photo ? recipe.photo : "no-photo.png"; // Default image if no photo
    document.getElementById("ingredientsDisplay").textContent = recipe.ingredients.join(", ");
    document.getElementById("categoryDisplay").textContent = recipe.category;
    document.getElementById("summaryDisplay").textContent = recipe.summary;

    // Display cooking process
    if (recipe.processes && recipe.processes.length > 0) {
        const processList = recipe.processes.map((process, index) => `<div>${index + 1}. ${process}</div>`).join('');
        document.getElementById("processDisplay").innerHTML = processList;
    } else {
        document.getElementById("processDisplay").textContent = "Cooking process not available.";
    }
}
