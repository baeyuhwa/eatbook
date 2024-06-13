let db;
const request = indexedDB.open("recipesDatabase", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("recipes", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("name", "name", { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadRecipes();
};

request.onerror = function(event) {
    console.error("Database error: " + event.target.errorCode);
};

function loadRecipes() {
    const transaction = db.transaction(["recipes"], "readonly");
    const objectStore = transaction.objectStore("recipes");

    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const recipes = event.target.result;
        displayPosts(recipes);
    };

    request.onerror = function(event) {
        console.error("Unable to retrieve data", event.target.error);
    };
}

function displayPosts(posts) {
    const tableBody = document.getElementById('recipe-list');
    tableBody.innerHTML = '';

    posts.forEach((post, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><a href="8-1_see.html?index=${post.id}" class="recipe-link" onclick="generateQRCodeForRecipe(${post.id})">${post.name}</a></td>
            <td>${post.sumup}</td>
            <td><button class='delete-button' data-id='${post.id}'>&#10006;</button></td>
        `;
        tableBody.appendChild(row);
    });

    const deleteButtons = tableBody.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const id = Number(this.getAttribute('data-id'));
            deleteRecipe(id);
        });
    });
}

function deleteRecipe(id) {
    const transaction = db.transaction(["recipes"], "readwrite");
    const objectStore = transaction.objectStore("recipes");

    const request = objectStore.delete(id);

    request.onsuccess = function(event) {
        console.log("데이터베이스에서 레시피가 삭제되었습니다.");
        loadRecipes();
    };

    request.onerror = function(event) {
        console.error("데이터를 삭제할 수 없습니다.", event.target.error);
    };
}

window.onload = function() {
    request.onsuccess = function(event) {
        db = event.target.result;
        loadRecipes();
    };
};
