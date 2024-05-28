document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const recipeIndex = params.get('index');
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    if (recipeIndex !== null && recipes[recipeIndex]) {
        const recipe = recipes[recipeIndex];
        document.getElementById('recipe-name').textContent = recipe.name;
        // 이미지가 표시될 영역에 이미지 추가
        document.getElementById('recipe-photo').src = recipe.photo;
        // 나머지 레시피 정보 표시
        document.getElementById('recipe-ingredient').textContent = recipe.ingredient;
        document.getElementById('recipe-category').textContent = recipe.category;
        document.getElementById('recipe-process').textContent = recipe.process;
        document.getElementById('recipe-sumup').textContent = recipe.sumup;
    } else {
        alert('레시피 정보를 불러올 수 없습니다.');
    }
});
