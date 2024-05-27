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

    // 삭제 버튼에 클릭 이벤트 추가
    var deleteButtons = recipeList.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            var id = this.getAttribute('data-id');
            deletePost(id);
        });
    });
});

function deletePost(id) {
    var storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
        var recipes = JSON.parse(storedRecipes);
        recipes.splice(id, 1); // 해당 레시피를 배열에서 삭제
        localStorage.setItem('recipes', JSON.stringify(recipes)); // 변경된 레시피 목록을 저장
        displayPosts(recipes); // 레시피 목록 갱신
    }
}
