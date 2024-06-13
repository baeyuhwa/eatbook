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
            console.log(recipe);

            if (recipe) {
                document.getElementById('recipe-name').textContent = recipe.name;
                //이미지 표시
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
