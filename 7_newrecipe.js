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
function saveRecipe(event) {
    event.preventDefault();

    const recipe = {
        name: document.getElementById('recipe').value,
        ingredient: document.getElementById('ingredient').value,
        category: document.getElementById('category').value,
        process: document.getElementById('process').value,
        sumup: document.getElementById('sumup').value,
        photo: document.getElementById('photo-preview').innerHTML // 이미지를 HTML 형식의 문자열로 저장 (이 예제에서는 간단하게 처리)
    };

    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // 등록 후 폼 초기화
    document.getElementById('newrecipe').reset();
    alert("레시피가 등록되었습니다.");
}
