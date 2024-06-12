window.onload = async function() {
    const searchQuery = localStorage.getItem('searchQuery');
    if (searchQuery) {
        await searchRecipe(searchQuery);
    }
}

async function searchRecipe(foodName) {
    const resultsContainer = document.getElementById('recipe-results');
    resultsContainer.innerHTML = ''; // 결과 컨테이너 초기화
    
    try {
        const results = await fetchFoodInfo(foodName);
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
                    window.location.href = '6_recipe_detail.html';
                });
                resultsContainer.appendChild(recipeColumn);

                document.getElementById('progress-bar').style.display = 'none';
                document.getElementById('progress-percentage').style.display = 'none';
                document.getElementById('to-top').style.display = 'flex';
            });
        } else {
            resultsContainer.innerHTML = '음식 정보를 가져오는데 실패했습니다.';
        }
    } catch (error) {
        console.error("Error fetching recipe information:", error);
    }
}

async function fetchFoodInfo(name) {
    const url = `https://cors-anywhere-o5bm.onrender.com/http://www.10000recipe.com/recipe/list.html?q=${name}`;
    const response = await fetch(url);
    const results = [];

    if (response.ok) {
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const foodList = doc.querySelectorAll('.common_sp_link');
        if (foodList.length === 0) {
            console.log("해당 음식에 대한 정보를 찾을 수 없습니다.");
            return results;
        }
        
        const promises = Array.from(foodList).map(async food => {
            const foodId = food.getAttribute('href').split('/').pop();
            const newUrl = `https://cors-anywhere-o5bm.onrender.com/http://www.10000recipe.com/recipe/${foodId}`;
            const newResponse = await fetch(newUrl);
            
            if (newResponse.ok) {
                const newHtml = await newResponse.text();
                const newDoc = parser.parseFromString(newHtml, 'text/html');
                
                const foodInfoElement = newDoc.querySelector('[type="application/ld+json"]');
                if (!foodInfoElement) {
                    console.log(`레시피 정보 요소를 찾을 수 없습니다: ${newUrl}`);
                    return null;
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

                return {
                    name: foodName,
                    image: foodImg,
                    author: author,
                    description: description,
                    ingredients: ingredient,
                    recipeImg: recipeImg,
                    recipe: recipe
                };
            } else {
                console.log("HTTP response error:", newResponse.status);
                return null;
            }
        });

        const resolvedPromises = await Promise.all(promises);
        results.push(...resolvedPromises.filter(result => result !== null));
    } else {
        console.log("HTTP response error:", response.status);
    }

    return results;
}

function go_top() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
