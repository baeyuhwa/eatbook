window.onload = function() {
    // 작성된 게시물이 있는지 확인 후 표시
    var storedPosts = localStorage.getItem('newQnaPosts');
    if (storedPosts) {
        var posts = JSON.parse(storedPosts);
        displayPosts(posts);
    }
};

function displayPosts(posts) {
    var tableBody = document.getElementById('postList'); // 게시물을 표시할 위치 지정
    posts.forEach((post, index) => {
        var row = document.createElement('tr');
        row.innerHTML = "<td>" + (index + 1) + "</td><td><a href='10-2_see.html?index=" + index + "'>" + post.title + "</a></td><td>" + post.date + "</td>";
        tableBody.appendChild(row);
    });
}
