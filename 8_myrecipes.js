window.onload = function() {
    var storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
        var recipes = JSON.parse(storedRecipes);
        displayPosts(recipes);
    }
};

function displayPosts(posts) {
    var tableBody = document.getElementById('recipe-list'); // 테이블 바디 참조
    tableBody.innerHTML = ''; // 이전 내용을 지움

    posts.forEach((post, index) => {
        var row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><a href="8-1_see.html?index=${index}" class="recipe-link">${post.name}</a></td>
            <td>${post.sumup}</td> <!-- 수정된 부분: summary 대신 sumup을 사용 -->
            <td><button class='delete-button' data-id='${index}'>&#10006;</button></td>
        `;
        tableBody.appendChild(row);
    });

    // 삭제 버튼에 클릭 이벤트 추가
    var deleteButtons = tableBody.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            var id = this.getAttribute('data-id');
            deletePost(id);
        });
    });
}

function deletePost(id) {
    var storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
        var recipes = JSON.parse(storedRecipes);
        recipes.splice(id, 1); // 해당 레시피를 배열에서 삭제
        localStorage.setItem('recipes', JSON.stringify(recipes)); // 변경된 레시피 목록을 저장
        displayPosts(recipes); // 레시피 목록 갱신
    }
}
