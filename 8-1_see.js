document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const recipeIndex = Number(params.get('index'));

    if (isNaN(recipeIndex)) {
        alert('유효하지 않은 레시피 인덱스입니다.');
        return;
    }

    let db;
    const request = indexedDB.open("recipesDatabase", 1);

    request.onsuccess = function(event) {
        db = event.target.result;
        loadRecipe(recipeIndex);
    };

    request.onerror = function(event) {
        console.error("Database error: " + event.target.errorCode);
        alert('레시피 정보를 불러올 수 없습니다.');
    };

    function loadRecipe(id) {
        const transaction = db.transaction(["recipes"], "readonly");
        const objectStore = transaction.objectStore("recipes");

        const request = objectStore.get(id);

        request.onsuccess = function(event) {
            const recipe = event.target.result;
            console.log(recipe);

            if (recipe) {
                document.getElementById('recipe-name').textContent = recipe.name;
                // 이미지 표시
                if (recipe.photo) {
                    document.getElementById('recipe-photo').src = recipe.photo;
                } else {
                    document.getElementById('recipe-photo').alt = '사진이 없습니다.';
                }

                // 재료 표시
                if (recipe.ingredients && recipe.ingredients.length > 0) {
                    const ingredientList = recipe.ingredients.join(', ');
                    document.getElementById('recipe-ingredient').textContent = ingredientList;
                } else {
                    document.getElementById('recipe-ingredient').textContent = '재료 정보가 없습니다.';
                }

                // 카테고리 표시
                document.getElementById('recipe-category').textContent = recipe.category;

                // 조리 과정 표시
                if (recipe.processes && recipe.processes.length > 0) {
                    const processList = recipe.processes.map((process, index) => `<div>${index + 1}. ${process}<div>`).join('');
                    document.getElementById('recipe-process').innerHTML = `<div>${processList}</div>`;
                } else {
                    document.getElementById('recipe-process').innerHTML = '조리 과정 정보가 없습니다.';
                }

                // 레시피 요약 표시
                document.getElementById('recipe-sumup').textContent = recipe.sumup;
            } else {
                alert('레시피 정보를 불러올 수 없습니다.');
            }
        };

        request.onerror = function(event) {
            console.error("Unable to retrieve data", event.target.error);
            alert('레시피 정보를 불러올 수 없습니다.');
        };
    }
});

// IndexedDB 설정
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

    // 레시피 정보를 IndexedDB에 저장
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    const recipe = {
        name: recipeName,
        ingredients: ingredients.split("\n"),
        category: category,
        summary: summary,
        processes: process.split("\n"),
        photo: null // 이미지 데이터는 여기에 Blob 형태로 저장될 예정
    };

    const addRequest = store.add(recipe);

    addRequest.onsuccess = function(event) {
        console.log("Recipe added to IndexedDB:", event.target.result);
        const recipeId = event.target.result;

        // 사진 데이터 처리
        if (photoFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const photoDataUrl = event.target.result;
                recipe.photo = photoDataUrl;

                // QR 코드 생성
                generateQRCode(recipeId, recipe);
            };
            reader.readAsDataURL(photoFile);
        } else {
            // 사진이 없는 경우도 QR 코드 생성
            generateQRCode(recipeId, recipe);
        }
    };

    addRequest.onerror = function(event) {
        console.error("Failed to add recipe to IndexedDB:", event.target.error);
    };
}

function generateQRCode(recipeId, recipe) {
    // QR 코드 생성
    const qrCodeContainer = document.createElement("div");
    new QRCode(qrCodeContainer, {
        text: `${window.location.origin}/view_recipe.html?id=${recipeId}`,
        width: 200,
        height: 200
    });

    // QR 코드를 화면에 추가
    const app = document.getElementById("app");
    app.appendChild(qrCodeContainer);

    // 생성된 QR 코드 아래에 스캔된 레시피 정보 표시
    displayScannedRecipe(recipe);
}

function displayScannedRecipe(recipe) {
    document.getElementById("recipeNameDisplay").textContent = recipe.name;
    document.getElementById("recipePhotoDisplay").src = recipe.photo ? recipe.photo : "no-photo.png"; // 사진 없을 시 기본 이미지
    document.getElementById("ingredientsDisplay").textContent = recipe.ingredients.join(", ");
    document.getElementById("categoryDisplay").textContent = recipe.category;
    document.getElementById("summaryDisplay").textContent = recipe.summary;

    // 조리 과정 처리
    if (recipe.processes && recipe.processes.length > 0) {
        const processList = recipe.processes.map((process, index) => `<div>${index + 1}. ${process}</div>`).join('');
        document.getElementById("processDisplay").innerHTML = processList;
    } else {
        document.getElementById("processDisplay").textContent = "조리 과정 정보가 없습니다.";
    }
}
