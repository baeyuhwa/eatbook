document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const recipeIndex = params.get('index');
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    if (recipeIndex !== null && recipes[recipeIndex]) {
        const recipe = recipes[recipeIndex];
        document.getElementById('recipe-name').textContent = recipe.name;
        document.getElementById('recipe-ingredient').textContent = recipe.ingredient;
        document.getElementById('recipe-category').textContent = recipe.category;
        document.getElementById('recipe-process').textContent = recipe.process;
        document.getElementById('recipe-sumup').textContent = recipe.sumup;
    } else {
        alert('레시피 정보를 불러올 수 없습니다.');
    }
});
