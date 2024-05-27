document.addEventListener('DOMContentLoaded', function() {
    const recipeList = document.getElementById('recipe-list');
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    recipes.forEach((recipe, index) => {
        const row = document.createElement('tr');
        
        const cellIndex = document.createElement('td');
        cellIndex.textContent = index + 1;
        
        const cellName = document.createElement('td');
        const nameLink = document.createElement('a');
        nameLink.href = `8-1_see.html?index=${index}`;
        nameLink.textContent = recipe.name;
        cellName.appendChild(nameLink);
        
        const cellSumup = document.createElement('td');
        cellSumup.textContent = recipe.sumup;
        
        row.appendChild(cellIndex);
        row.appendChild(cellName);
        row.appendChild(cellSumup);
        
        recipeList.appendChild(row);
    });
});
