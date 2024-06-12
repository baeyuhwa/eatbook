let db;
const request = indexedDB.open("recipesDatabase", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("recipes", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("name", "name", { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
};

request.onerror = function(event) {
    console.error("Database error: " + event.target.errorCode);
};

function saveRecipe(event) {
    event.preventDefault();

    const name = document.getElementById('recipe').value;
    const ingredient = document.getElementById('ingredient').value;
    const category = document.getElementById('category').value;
    const process = document.getElementById('process').value;
    const sumup = document.getElementById('sumup').value;
    const photoInput = document.getElementById('photo');
    const photoFile = photoInput.files[0];

    const reader = new FileReader();

    reader.onload = function(event) {
        const transaction = db.transaction(["recipes"], "readwrite");
        const objectStore = transaction.objectStore("recipes");

        const recipe = {
            name: name,
            ingredient: ingredient,
            category: category,
            process: process,
            sumup: sumup,
            photo: event.target.result // Blob 데이터
        };

        const request = objectStore.add(recipe);
        request.onsuccess = function() {
            console.log("Recipe has been added to your database.");
            document.getElementById('newrecipe').reset();
            document.getElementById('photo-preview').innerHTML='';
            alert("레시피가 등록되었습니다.");
            window.location.href = "8_myrecipes.html";
        };

        request.onerror = function() {
            console.error("Unable to add data", request.error);
        };
    };

    if (photoFile) {
        reader.readAsDataURL(photoFile);
    } else {
        const transaction = db.transaction(["recipes"], "readwrite");
        const objectStore = transaction.objectStore("recipes");

        const recipe = {
            name: name,
            ingredient: ingredient,
            category: category,
            process: process,
            sumup: sumup,
            photo: null
        };

        const request = objectStore.add(recipe);
        request.onsuccess = function() {
            console.log("Recipe has been added to your database.");
            document.getElementById('newrecipe').reset();
            document.getElementById('photo-preview').innerHTML='';
            alert("레시피가 등록되었습니다.");
            window.location.href = "8_myrecipes.html";
        };

        request.onerror = function() {
            console.error("Unable to add data", request.error);
        };
    }
}

function previewPhoto() {
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photo-preview');
    const file = photoInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            photoPreview.innerHTML = '';
            photoPreview.appendChild(img);
        };

        reader.readAsDataURL(file);
    } else {
        photoPreview.innerHTML = '이미지를 선택해주세요.';
    }
}
