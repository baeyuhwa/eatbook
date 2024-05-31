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

            const randomRecipes = recipes.slice(0, 2);

            randomRecipes.forEach(result => {
                const recipeColumn = document.createElement('div');
                recipeColumn.classList.add('recipe-column');
    
                const recipeTitle = document.createElement('h2');
                recipeTitle.textContent = result.title;
                recipeColumn.appendChild(recipeTitle);
    
                const recipeImage = document.createElement('img');
                recipeImage.src = result.imgUrl;
                recipeImage.alt = `이미지: ${result.imgUrl}`;
                recipeColumn.appendChild(recipeImage);
    
                const recipeAuthor = document.createElement('div');
                recipeAuthor.textContent = "작성자: " + result.author;
                recipeColumn.appendChild(recipeAuthor);

                /*recipeColumn.addEventListener('click', () => {
                    window.open(`https://www.10000recipe.com/${result.url}`, '_blank');
                });*/
                resultsContainer.appendChild(recipeColumn);
                });
        } else {
            resultsContainer.innerHTML = '인기 레시피를 가져오는 데 실패했습니다.';
        }
    } else {
        console.error('Fetch error: ' + response.status);
    }
}