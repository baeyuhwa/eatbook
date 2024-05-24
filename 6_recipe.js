window.onload = function() {
    document.getElementById('search-bar').addEventListener('keyup', function(event) {
        if(event.key == "Enter") {
            console.log(this.value);
            searchRecipe(this.value);
        }
    });
}

async function foodInfo(name) {
    const url = 'https://cors-anywhere-o5bm.onrender.com/' + `http://www.10000recipe.com/recipe/list.html?q=${name}`;
    const response = await fetch(url);

    if (response.ok) {
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const foodList = doc.querySelectorAll('.common_sp_link');
        if (foodList.length === 0) {
            console.log("해당 음식에 대한 정보를 찾을 수 없습니다.");
            return [];
        }
        
        // 첫 10개의 항목 선택
        const selectedFoods = Array.from(foodList).slice(0, 10);
        const results = [];

        for (const food of selectedFoods) {
            const foodId = food.getAttribute('href').split('/').pop();
            const newUrl = 'https://cors-anywhere-o5bm.onrender.com/' + `http://www.10000recipe.com/recipe/${foodId}`;
            const newResponse = await fetch(newUrl);
            
            if (newResponse.ok) {
                const newHtml = await newResponse.text();
                const newDoc = parser.parseFromString(newHtml, 'text/html');
                
                const foodInfoElement = newDoc.querySelector('[type="application/ld+json"]');
                const result = JSON.parse(foodInfoElement.textContent);
                const foodName = result.name;
                const foodImg = result.image ? result.image[0] : '이미지 없음';
                const ingredient = result.recipeIngredient ? result.recipeIngredient.join(',') : '재료 정보 없음';
                const recipeImg = Array.isArray(result.recipeInstructions) ? result.recipeInstructions.map((instruction, index) => 
                    `${index + 1}. ${instruction.image}`): [];
                const recipe = Array.isArray(result.recipeInstructions) ? result.recipeInstructions.map((instruction, index) => 
                    `${index + 1}. ${instruction.text}`) : [];

                //console.log(recipeImg);
                //console.log(recipe);

                results.push({
                    name: foodName,
                    image: foodImg,
                    ingredients: ingredient,
                    recipeImg: recipeImg,
                    recipe: recipe
                });
            } else {
                console.log("HTTP response error:", newResponse.status);
            }
        }
        
        return results;
    } else {
        console.log("HTTP response error:", response.status);
        return [];
    }
}

async function searchRecipe(foodName) {
    const resultsContainer = document.getElementById('recipe-results');
    resultsContainer.innerHTML = ''; // 결과 컨테이너 초기화
    
    const results = await foodInfo(foodName);
    if (results.length > 0) {
        results.forEach(result => {
            const recipeColumn = document.createElement('div');
            recipeColumn.classList.add('recipe-column');

            const recipeTitle = document.createElement('h2');
            recipeTitle.textContent = result.name;
            recipeColumn.appendChild(recipeTitle);

            const recipeImage = document.createElement('img');
            recipeImage.src = result.image;
            recipeImage.alt = `이미지: ${result.name}`;
            recipeImage.addEventListener('click', () => {
                // 로컬 스토리지에 레시피 정보 저장
                localStorage.setItem('selectedRecipe', JSON.stringify(result));
                // 새로운 페이지로 이동
                window.location.href = '6_recipe_detail.html';
            });
            recipeColumn.appendChild(recipeImage);

            resultsContainer.appendChild(recipeColumn);
        });
    } else {
        resultsContainer.innerHTML = '음식 정보를 가져오는데 실패했습니다.';
    }
}

async function searchIngredient() {
    const fridgeItems = document.querySelectorAll('#fridge-list-items tr');

    //냉장고 리스트에서 재료를 가져오고 배열에 저장
    let fridgeIngredients = [];
    fridgeItems.forEach(item => {
        const ingredientName = item.cells[0].textContent.trim().toLowerCase(); // 재료 이름
        fridgeIngredients.push(ingredientName);
    });

    for (let ingredient of fridgeIngredients) {
        searchRecipe(ingredient);
    }
}
