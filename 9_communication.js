document.addEventListener('DOMContentLoaded', function() {
    const kakaoNickname = localStorage.getItem('kakaoNickname');
    if (kakaoNickname) {
        document.getElementById('login-menu').style.display = 'none';
        const userNameMenu = document.getElementById('user-name-menu');
        userNameMenu.style.display = 'block';
        const userNameElement = document.getElementById('user-name');
        userNameElement.textContent = kakaoNickname;

        // 로그인 메뉴와 동일한 스타일 적용
        userNameElement.style.color = '#fff';
        userNameElement.style.fontFamily = 'Work Sans, sans-serif';
        userNameElement.style.fontSize = '1rem';
        userNameElement.style.textDecoration = 'none';
    }
});

window.onload = function() {
    var storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
        var posts = JSON.parse(storedPosts);
        displayPosts(posts);
    }
};

function displayPosts(posts) {
    var tableBody = document.getElementById('postList');
    if (!tableBody) {
        console.error("postList element not found");
        return;
    }
    tableBody.innerHTML = '';
    posts.forEach((post, index) => {
        var row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td><a href='9-2_see.html' data-id='${index}'>${post.title}</a></td><td>${post.date}</td><td><button class='delete-button' data-id='${index}'>&#10006;</button></td>`;
        tableBody.appendChild(row);
    });

    var links = tableBody.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            var id = this.getAttribute('data-id');
            localStorage.setItem('selectedPostId', id);
        });
    });

    var deleteButtons = tableBody.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            var id = this.getAttribute('data-id');
            deletePost(id);
        });
    });
}

function deletePost(id) {
    var storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
        var posts = JSON.parse(storedPosts);
        posts.splice(id, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts(posts);
    }
}

function performSearch() {
    const searchValue = document.getElementById('search-bar').value;
    localStorage.setItem('searchQuery', searchValue);
    window.location.href = '5_recipe_result.html';
}
