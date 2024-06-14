window.onload = function() {
    const recipeDetail = document.getElementById('recipe-detail');
    const selectedRecipe = JSON.parse(localStorage.getItem('selectedRecipe'));

    if (selectedRecipe) {
        const recipeTitle = document.createElement('h2');
        recipeTitle.textContent = selectedRecipe.name;
        recipeDetail.appendChild(recipeTitle);

        const header = document.getElementById('searchHeader');
        header.innerHTML = selectedRecipe.name;

        const recipeAuthor = document.createElement('h4');
        recipeAuthor.textContent = "작성자: " + selectedRecipe.author;
        recipeDetail.appendChild(recipeAuthor);

        const recipeImage = document.createElement('img');
        recipeImage.src = selectedRecipe.image;
        recipeImage.alt = `이미지: ${selectedRecipe.name}`;
        recipeImage.style.maxWidth = '60%';
        recipeImage.style.paddingLeft = '20px';
        recipeDetail.appendChild(recipeImage);

        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.textContent = '재료';
        recipeDetail.appendChild(ingredientsTitle);

        const ingredientsTable = document.createElement('table');
        ingredientsTable.classList.add('ingredients-table');

        selectedRecipe.ingredients.split(',').forEach(ingredient => {
            const tr = document.createElement('tr');

            const ingredientName = document.createElement('td');
            ingredientName.textContent = ingredient.split(' ')[0];
            tr.appendChild(ingredientName);

            const ingredientAmount = document.createElement('td');
            ingredientAmount.textContent = ingredient.split(' ')[1] || '';
            tr.appendChild(ingredientAmount);

            ingredientsTable.appendChild(tr);
        });
        recipeDetail.appendChild(ingredientsTable);

        const stepsTitle = document.createElement('h5');
        stepsTitle.textContent = '조리순서';
        recipeDetail.appendChild(stepsTitle);

        selectedRecipe.recipe.forEach((step, index) => {
            const stepContainer = document.createElement('div');
            stepContainer.classList.add('step-container');

            /*const stepNumber = document.createElement('h4');
            stepNumber.textContent = `${index + 1}.`;
            stepContainer.appendChild(stepNumber);*/

            const imgContainer = document.createElement('div');
            imgContainer.classList.add('img-container');
            const imgElement = document.createElement('img');
            const imgUrl = selectedRecipe.recipeImg[index].split(' ').pop();
            if (imgUrl && imgUrl !== "undefined" && imgUrl !== null) {
                imgElement.src = imgUrl;
                imgElement.alt = `${index + 1}단계 이미지`;
                imgElement.style.maxWidth = '100%';
                imgContainer.appendChild(imgElement);
                stepContainer.appendChild(imgContainer);
            }

            const textContainer = document.createElement('div');
            textContainer.classList.add('text-container');
            textContainer.innerHTML = `<p>${step}</p>`;

            stepContainer.appendChild(textContainer);
            recipeDetail.appendChild(stepContainer);
        });
    } else {
        recipeDetail.innerHTML = '레시피 정보를 불러오는데 실패했습니다.';
    }
};



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

            //console.log(recipeImg);
            //console.log(recipe);

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
    const recipeDetail = document.getElementById('recipe-detail');
    recipeDetail.innerHTML = '';
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

function go_top() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

