window.onload = function() {
    document.getElementById('search-bar').addEventListener('keyup', function(event) {
        if(event.key == "Enter") {
            console.log(this.value);
            searchRecipe(this.value);
        }
    });
    loadFridgeList();
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

        const selectedFoods = Array.from(foodList);
        const totalFoods = selectedFoods.length;
        const results = [];

        for (let i = 0; i < totalFoods; i++) {
            const food = selectedFoods[i];
            const foodId = food.getAttribute('href').split('/').pop();
            const newUrl = 'https://cors-anywhere-o5bm.onrender.com/' + `http://www.10000recipe.com/recipe/${foodId}`;
            const newResponse = await fetch(newUrl);
            
            if (newResponse.ok) {
                const newHtml = await newResponse.text();
                const newDoc = parser.parseFromString(newHtml, 'text/html');
                
                const foodInfoElement = newDoc.querySelector('[type="application/ld+json"]');
                if (!foodInfoElement) {
                    console.log(`레시피 정보 요소를 찾을 수 없습니다: ${newUrl}`);
                    continue; // foodInfoElement가 null인 경우 건너뜁니다.
                }
                const result = JSON.parse(foodInfoElement.textContent);
                const foodName = result.name;
                const foodImg = result.image ? result.image[0] : '이미지 없음';
                const author = result.author["name"];
                const description = result.description;
                const ingredient = result.recipeIngredient ? result.recipeIngredient.join(',') : '재료 정보 없음';
                const recipeImg = Array.isArray(result.recipeInstructions) ? result.recipeInstructions.map((instruction, index) => 
                    `${index + 1}. ${instruction.image}`): [];
                const recipe = Array.isArray(result.recipeInstructions) ? result.recipeInstructions.map((instruction, index) => 
                    `${index + 1}. ${instruction.text}`) : [];

                results.push({
                    name: foodName,
                    image: foodImg,
                    author: author,
                    description: description,
                    ingredients: ingredient,
                    recipeImg: recipeImg,
                    recipe: recipe
                });

                // 진행 상황 업데이트
                const progress = Math.floor(((i + 1) / totalFoods) * 100);
                document.getElementById('progress-bar').style.display = 'flex';
                document.getElementById('progress-bar').style.width = progress + '%';
                document.getElementById('progress-percentage').style.display = 'flex';
                document.getElementById('progress-percentage').textContent = '검색 결과를 표시하는 중입니다... ' + progress + '%';
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
            recipeColumn.appendChild(recipeImage);

            const recipeAuthor = document.createElement('div');
            recipeAuthor.textContent = "작성자: " + result.author;
            recipeColumn.append(recipeAuthor);

            const recipeDescription = document.createElement('div');
            recipeDescription.textContent = result.description;
            recipeColumn.append(recipeDescription);

            recipeColumn.addEventListener('click', () => {
                // 로컬 스토리지에 레시피 정보 저장
                localStorage.setItem('selectedRecipe', JSON.stringify(result));
                // 새로운 페이지로 이동
                window.open('6_recipe_detail.html', '_blank');
            });
            resultsContainer.appendChild(recipeColumn);

            document.getElementById('progress-bar').style.display = 'none';
            document.getElementById('progress-percentage').style.display = 'none';
            document.getElementById('to-top').style.display = 'flex';
        });
    } else {
        resultsContainer.innerHTML = '음식 정보를 가져오는데 실패했습니다.';
    }
}

async function searchIngredient() {
    document.getElementById('to-top').style.display = 'none';
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

function go_top() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadFridgeList() {
    var list = document.getElementById('fridge-list-items');
    var items = JSON.parse(localStorage.getItem('fridgeList')) || [];

    items.forEach(item => {
        var row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.ingredient}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${item.expiration}</td>
            <td><button class="edit-btn">수정</button></td>
            <td><button class="delete-btn">삭제</button></td>
        `;
        
        list.appendChild(row);

        // 삭제 버튼 이벤트 리스너
        row.querySelector('.delete-btn').addEventListener('click', function() {
            list.removeChild(row);
            saveFridgeList(); // 수정한 부분: 로컬 스토리지에 저장
        });

        // 수정 버튼 이벤트 리스너
        row.querySelector('.edit-btn').addEventListener('click', function() {
            // 입력 필드로 데이터 이동
            document.getElementById('ingredient-name').value = item.ingredient;
            document.getElementById('ingredient-quantity').value = item.quantity;
            document.getElementById('ingredient-unit').value = item.unit;
            document.getElementById('expiration-date').value = item.expiration;
    
            // 수정 모드 활성화
            var index = Array.from(list.children).indexOf(row);
            document.getElementById('fridge-form').setAttribute('data-editing-index', index);
        });
    });
}