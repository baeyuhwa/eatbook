window.onload = function() {
    getEvent();
    document.getElementById('search-bar').addEventListener('keyup', function(event) {
        if(event.key == "Enter") {
            console.log(this.value);
            searchRecipe(this.value);
        }
    });
}

const url = "http://openapi.foodsafetykorea.go.kr/api/41c6772882e24fee85f2/COOKRCP01/json/1/1000";

let recipes = [];

async function getEvent() {
    const response = await fetch(url);
    var data = await response.json();

    recipes = data.COOKRCP01.row;
}

function searchRecipe(foodName) {
    const resultsContainer = document.getElementById('recipe-results');
    resultsContainer.innerHTML = ''; // 결과 컨테이너 초기화
    
    recipes.forEach(recipe => {
        if(recipe.RCP_NM.toLowerCase().includes(foodName.toLowerCase())) { // 레시피 이름에 검색어가 포함되어 있는 경우(대소문자 구분 없음)
            const recipeTitle = document.createElement('h2'); // 레시피 제목을 위한 요소
            recipeTitle.textContent = recipe.RCP_NM; // 레시피 이름 설정
            resultsContainer.appendChild(recipeTitle); // 결과 컨테이너에 레시피 제목 추가

            for(let step = 1; step <= 20; step++) {
                const manualKey = `MANUAL${step.toString().padStart(2, '0')}`;
                const manualImgKey = `MANUAL_IMG${step.toString().padStart(2, '0')}`;
                const manualText = recipe[manualKey];
                const manualImg = recipe[manualImgKey];

                if(manualText && manualImg) {
                    const stepContainer = document.createElement('div'); // 각 단계를 위한 컨테이너
                    stepContainer.classList.add('step-container');

                    const imgContainer = document.createElement('div'); // 이미지 컨테이너
                    imgContainer.classList.add('img-container');
                    imgContainer.innerHTML = `<img src="${manualImg}" alt="Step ${step}">`;

                    const textContainer = document.createElement('div'); // 텍스트 컨테이너
                    textContainer.classList.add('text-container');
                    textContainer.innerHTML = `<p>${manualText}</p>`;

                    stepContainer.appendChild(imgContainer); // 단계 컨테이너에 이미지 컨테이너 추가
                    stepContainer.appendChild(textContainer); // 단계 컨테이너에 텍스트 컨테이너 추가

                    resultsContainer.appendChild(stepContainer); // 전체 결과 컨테이너에 단계별 컨테이너 추가
                }
            }
        }
    });
}

function searchIngredient() {
    const fridgeItems = document.querySelectorAll('#fridge-list-items tr');
    const resultsContainer = document.getElementById('recipe-results');
    resultsContainer.innerHTML = ''; // 결과 컨테이너 초기화

    let fridgeIngredients = [];
    fridgeItems.forEach(item => {
        const ingredientName = item.cells[0].textContent.trim().toLowerCase(); // 재료 이름
        fridgeIngredients.push(ingredientName);
    });

    recipes.forEach(recipe => {
        const recipeIngredientsDetails = recipe.RCP_PARTS_DTLS.split('\n').join(',').toLowerCase();
        let isMatched = fridgeIngredients.some(fridgeIngredient => recipeIngredientsDetails.includes(fridgeIngredient));
        
        if(isMatched) {
            const recipeElement = document.createElement('div'); // 레시피를 담을 새로운 div 요소
            recipeElement.className = 'recipe-column'; // CSS 클래스 적용

            const recipeTitle = document.createElement('h2');
            recipeTitle.textContent = recipe.RCP_NM;
            recipeElement.appendChild(recipeTitle); // 레시피 제목을 div 요소에 추가

            resultsContainer.appendChild(recipeElement); // 결과 컨테이너에 레시피 컨테이너 추가
        }
    });
}

