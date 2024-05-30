document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const recipeIndex = Number(params.get('index'));
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
            if (recipe) {
                document.getElementById('recipe-name').textContent = recipe.name;
                // 이미지가 표시될 영역에 이미지 추가
                if (recipe.photo) {
                    document.getElementById('recipe-photo').src = recipe.photo;
                } else {
                    document.getElementById('recipe-photo').alt = '사진이 없습니다.';
                }
                // 나머지 레시피 정보 표시
                document.getElementById('recipe-ingredient').textContent = recipe.ingredient;
                document.getElementById('recipe-category').textContent = recipe.category;
                document.getElementById('recipe-process').textContent = recipe.process;
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
