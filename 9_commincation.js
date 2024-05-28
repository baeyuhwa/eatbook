window.onload = function() {
    // 작성된 게시물이 있는지 확인 후 표시
    var storedPosts = localStorage.getItem('newPosts');
    if (storedPosts) {
        var posts = JSON.parse(storedPosts);
        displayPosts(posts);
    }
};

function displayPosts(posts) {
    var tableBody = document.getElementById('postList'); // 게시물을 표시할 위치 지정
    if (!tableBody) {
        console.error("postList element not found");
        return;
    }
    tableBody.innerHTML = ''; // 기존 내용을 초기화
    posts.forEach((post, index) => {
        var row = document.createElement('tr');
        row.innerHTML = "<td>" + (index + 1) + "</td><td><a href='9-2_see.html' data-id='" + index + "'>" + post.title + "</a></td><td>" + post.date + "</td><td><button class='delete-button' data-id='" + index + "'>&#10006;</button></td>";
        tableBody.appendChild(row);
    });

    // 제목에 클릭 이벤트 추가
    var links = tableBody.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            var id = this.getAttribute('data-id');
            localStorage.setItem('selectedPostId', id);
        });
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
    var storedPosts = localStorage.getItem('newPosts');
    if (storedPosts) {
        var posts = JSON.parse(storedPosts);
        posts.splice(id, 1); // 해당 게시물을 배열에서 삭제
        localStorage.setItem('newPosts', JSON.stringify(posts)); // 변경된 게시물 목록을 저장
        displayPosts(posts); // 게시물 목록 갱신
    }
}
