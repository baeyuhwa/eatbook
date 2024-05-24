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
        
        // 첫 5개의 항목을 선택
        const selectedFoods = Array.from(foodList).slice(0, 5);
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
            const recipeTitle = document.createElement('h2'); // 레시피 제목을 위한 요소
            recipeTitle.textContent = result.name; // 레시피 이름 설정
            resultsContainer.appendChild(recipeTitle); // 결과 컨테이너에 레시피 제목 추가

            const recipeImage = document.createElement('img'); // 레시피 이미지를 위한 요소
            recipeImage.src = result.image; // 이미지 소스 설정
            recipeImage.alt = `이미지: ${result.name}`; // 대체 텍스트 설정
            recipeImage.style.maxWidth = '100%';
            resultsContainer.appendChild(recipeImage); // 결과 컨테이너에 이미지 추가

            const ingredients = document.createElement('h3');
            ingredients.textContent = `재료: ${result.ingredients}`;
            resultsContainer.appendChild(ingredients);

            result.recipe.forEach((step, index) => {
                const stepContainer = document.createElement('div'); // 각 단계를 위한 컨테이너
                stepContainer.classList.add('step-container');

                const imgContainer = document.createElement('div'); // 이미지 컨테이너
                imgContainer.classList.add('img-container');
                const imgElement = document.createElement('img');
                const imgUrl = result.recipeImg[index].split(' ').pop();
                if (imgUrl != "undefined" && imgUrl != null) {
                    imgElement.src = imgUrl;
                    imgElement.alt = `${index + 1}단계 이미지`;
                    imgElement.style.maxWidth = '100%';
                    imgContainer.appendChild(imgElement);
                    stepContainer.appendChild(imgContainer);
                }

                const textContainer = document.createElement('div'); // 텍스트 컨테이너
                textContainer.classList.add('text-container');
                textContainer.innerHTML = `<p>${step}</p>`;

                stepContainer.appendChild(textContainer); // 단계 컨테이너에 텍스트 컨테이너 추가

                resultsContainer.appendChild(stepContainer); // 전체 결과 컨테이너에 단계별 컨테이너 추가
            });
        });
    } else {
        resultsContainer.innerHTML = '음식 정보를 가져오는데 실패했습니다.';
    }
}

async function searchIngredient() {
    const fridgeItems = document.querySelectorAll('#fridge-list-items tr');
    const resultsContainer = document.getElementById('recipe-results');
    resultsContainer.innerHTML = ''; // 결과 컨테이너 초기화

    let fridgeIngredients = [];
    fridgeItems.forEach(item => {
        const ingredientName = item.cells[0].textContent.trim().toLowerCase(); // 재료 이름
        fridgeIngredients.push(ingredientName);
    });

    // Perform ingredient search for each item in the fridge
    for (let ingredient of fridgeIngredients) {
        const results = await foodInfo(ingredient);
        if (results.length > 0) {
            results.forEach(result => {
                const recipeElement = document.createElement('div'); // 레시피를 담을 새로운 div 요소
                recipeElement.className = 'recipe-column'; // CSS 클래스 적용

                const recipeTitle = document.createElement('h2');
                recipeTitle.textContent = result.name;
                recipeElement.appendChild(recipeTitle); // 레시피 제목을 div 요소에 추가

                resultsContainer.appendChild(recipeElement); // 결과 컨테이너에 레시피 컨테이너 추가
            });
        }
    }
}
