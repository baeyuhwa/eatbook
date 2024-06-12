let db;
const request = indexedDB.open("recipesDatabase", 1);

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
            deletePost(id);
        });
    });
}

function deletePost(id) {
    const transaction = db.transaction(["recipes"], "readwrite");
    const objectStore = transaction.objectStore("recipes");

    const request = objectStore.delete(id);

    request.onsuccess = function(event) {
        console.log("Recipe has been deleted from your database.");
        loadRecipes();
    };

    request.onerror = function(event) {
        console.error("Unable to delete data", event.target.error);
    };
}

window.onload = function() {
    request.onsuccess = function(event) {
        db = event.target.result;
        loadRecipes();
    };
};
