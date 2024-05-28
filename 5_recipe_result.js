window.onload = async function() {
    const searchQuery = localStorage.getItem('searchQuery');
    if(searchQuery) {
        await searchRecipe(searchQuery);
    }
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
        const selectedFoods = Array.from(foodList);
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

            document.getElementById('to-top').style.display = 'flex';
        });
    } else {
        resultsContainer.innerHTML = '음식 정보를 가져오는데 실패했습니다.';
    }
}

function go_top(orix, oriy, desx, desy) {
	var Timer;

	if (document.body.scrollTop == 0) {
		var winHeight = document.documentElement.scrollTop;
	} else {
		var winHeight = document.body.scrollTop;
	}

	if (Timer) clearTimeopt(Timer);
	startx = 0;
	starty = winHeight;

	if (!orix || orix < 0) orix = 0;
	if (!oriy || oriy < 0) oriy = 0;

	var speed = 7;

	if (!desx) desx = 0 + startx;
	if (!desy) desy = 0 + starty;
	desx += (orix - startx) /speed;
	if (desx < 0) desx = 0;
	desy += (oriy - starty) / speed;
	if (desy < 0) desy = 0;

	var posX = Math.ceil(desx); var posY = Math.ceil(desy);
	window.scrollTo(posX, posY);
	if ((Math.floor(Math.abs(startx - orix)) < 1) && (Math.floor(Math.abs(starty - oriy)) < 1)) {
		clearTimeout(Timer);
		window.scroll(orix, oriy);
	} else if (posX != orix || posY != oriy) {
		Timer = setTimeout("go_top(" + orix + ", " + oriy + ", " + desx + ", " + desy + ")", 15);
	} else {
		clearTimeout(Timer);
	}
}