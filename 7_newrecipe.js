function openUpdatePage() {
    var windowFeatures = "width=600,height=400,scrollbars=yes,resizable=yes";
    window.open("3_update.html", "UpdateUserInfo", windowFeatures);
}

function saveRecipe(event) {
    event.preventDefault();

    const recipe = {
        name: document.getElementById('recipe').value,
        ingredient: document.getElementById('ingredient').value,
        category: document.getElementById('category').value,
        process: document.getElementById('process').value,
        sumup: document.getElementById('sumup').value,
        // 사진을 로컬 스토리지에 저장할 수 없으므로 이 예에서는 생략
    };

    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // 등록 후 폼 초기화
    document.getElementById('newrecipe').reset();
    alert("레시피가 등록되었습니다.");
}
