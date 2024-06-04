window.onload = function() {
    popularRecipe();
}

async function popularRecipe() {
    const url = 'https://cors-anywhere-o5bm.onrender.com/' + 'http://www.10000recipe.com';
    const response = await fetch(url);

    if(response.ok) {
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const bestItems = doc.querySelectorAll('.common_sp_list_li');
        const recipes = [];

        bestItems.forEach(item => {
            const titleElement = item.querySelector('.common_sp_caption_tit');
            const urlElement = item.querySelector('.common_sp_link');
            const authorElement = item.querySelector('.common_sp_caption_rv_name a');
            const imgElement = item.querySelector('.common_sp_thumb img');

            if (titleElement && urlElement && authorElement && imgElement) {
                const title = titleElement.innerText;
                const url = urlElement.getAttribute('href');
                const author = authorElement.innerText;
                const imgUrl = imgElement.getAttribute('src');

                const recipe = {
                    title: title,
                    url: url,
                    author: author,
                    imgUrl: imgUrl
                };
                recipes.push(recipe);
            }
        });
        console.log('Recipes:', recipes);

        const resultsContainer = document.getElementById('recipe-results');
        resultsContainer.innerHTML = '';

        if (recipes.length > 0) {
            for (let i = recipes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [recipes[i], recipes[j]] = [recipes[j], recipes[i]];
            }

            const randomRecipes = recipes.slice(0, 3);

            randomRecipes.forEach(result => {
                const recipeColumn = document.createElement('div');
                recipeColumn.classList.add('recipe-column');

                const recipeTitle = document.createElement('h2');
                recipeTitle.textContent = result.title;
                recipeTitle.classList.add('recipe-title');

                recipeColumn.appendChild(recipeTitle);

                recipeColumn.addEventListener('click', () => {
                    searchRecipe(`http://www.10000recipe.com${result.url}`);
                });
                
                resultsContainer.appendChild(recipeColumn);
            });
        } else {
            resultsContainer.innerHTML = '인기 레시피를 가져오는 데 실패했습니다.';
        }
    } else {
        console.error('Fetch error: ' + response.status);
    }
}

async function foodInfo(url) {
    const newUrl = 'https://cors-anywhere-o5bm.onrender.com/' + url;
    const newResponse = await fetch(newUrl);
    const results = [];
    
    if (newResponse.ok) {
        const parser = new DOMParser();        
        const newHtml = await newResponse.text();
        const newDoc = parser.parseFromString(newHtml, 'text/html');
        
        const foodInfoElement = newDoc.querySelector('[type="application/ld+json"]');
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
        
    } else {
        console.log("HTTP response error:", newResponse.status);
    }
    return results;  
}

async function searchRecipe(url) {
    const results = await foodInfo(url);
    if (results.length > 0) {
        const result = results[0];
        // 로컬 스토리지에 레시피 정보 저장
        localStorage.setItem('selectedRecipe', JSON.stringify(result));
        // 새로운 페이지로 이동
        window.open('6_recipe_detail.html', '_blank');
    } else {
        alert('레시피 정보를 가져오는 데 실패했습니다.');
    }
}
