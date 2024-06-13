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
    const category = document.getElementById('category').value;
    const sumup = document.getElementById('sumup').value;
    const photoInput = document.getElementById('photo');
    const photoFile = photoInput.files[0];

    const reader = new FileReader();

    reader.onload = function(event) {
        const transaction = db.transaction(["recipes"], "readwrite");
        const objectStore = transaction.objectStore("recipes");

        // Get ingredients from input fields
        const ingredients = [];
        document.querySelectorAll('#ingredient-container input[name="ingredient"]').forEach(input => {
            const ingredient = input.value.trim();
            if (ingredient !== '') {
                ingredients.push(ingredient);
            }
        });

        // Get processes from input fields
        const processes = [];
        document.querySelectorAll('#process-container input[name="process"]').forEach(input => {
            const process = input.value.trim();
            if (process !== '') {
                processes.push(process);
            }
        });

        const recipe = {
            name: name,
            ingredients: ingredients,
            category: category,
            processes: processes,
            sumup: sumup,
            photo: event.target.result // Blob 데이터
        };

        const request = objectStore.add(recipe);
        request.onsuccess = function() {
            console.log("Recipe has been added to your database.");
            document.getElementById('newrecipe').reset();
            document.getElementById('photo-preview').innerHTML = '';
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

        // Get ingredients from input fields
        const ingredients = [];
        document.querySelectorAll('#ingredient-container input[name="ingredient"]').forEach(input => {
            const ingredient = input.value.trim();
            if (ingredient !== '') {
                ingredients.push(ingredient);
            }
        });

        // Get processes from input fields
        const processes = [];
        document.querySelectorAll('#process-container input[name="process"]').forEach(input => {
            const process = input.value.trim();
            if (process !== '') {
                processes.push(process);
            }
        });

        const recipe = {
            name: name,
            ingredients: ingredients,
            category: category,
            processes: processes,
            sumup: sumup,
            photo: null
        };

        const request = objectStore.add(recipe);
        request.onsuccess = function() {
            console.log("Recipe has been added to your database.");
            document.getElementById('newrecipe').reset();
            document.getElementById('photo-preview').innerHTML = '';
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

function addIngredientLine() {
    event.preventDefault();

    const container = document.getElementById('ingredient-container');
    const newInputDiv = document.createElement('div');
    newInputDiv.className = 'd-flex align-items-center';
    newInputDiv.innerHTML = `
        <input type="text" class="form-control border-0 bg-light" name="ingredient" onkeypress="if(event.key === 'Enter') addIngredientLine()">
        <button type="button" class="add-btn btn-success ms-3" onclick="addIngredientLine(this)">+</button>
        <button type="button" class="add-btn btn-danger ms-3" onclick="removeIngredientLine(this)">-</button>
    `;
    container.appendChild(newInputDiv);
}

function removeIngredientLine(button) {
    const container = document.getElementById('ingredient-container');
    container.removeChild(button.parentElement);
}

function addProcessLine() {
    event.preventDefault();
    
    const container = document.getElementById('process-container');
    const newInputDiv = document.createElement('div');
    newInputDiv.className = 'd-flex align-items-center';
    newInputDiv.innerHTML = `
        <input type="text" class="form-control border-0 bg-light" name="process" onkeypress="if(event.key === 'Enter') addProcessLine()">
        <button type="button" class="add-btn btn-success ms-3" onclick="addIngredientLine(this)">+</button>
        <button type="button" class="add-btn btn-danger ms-3" onclick="removeProcessLine(this)">-</button>
    `;
    container.appendChild(newInputDiv);
}

function removeProcessLine(button) {
    const container = document.getElementById('process-container');
    container.removeChild(button.parentElement);
}
