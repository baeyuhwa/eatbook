window.onload = function() {
    // 저장된 게시물 가져오기
    var storedPost = localStorage.getItem('newQnaPost');
    if (storedPost) {
        var post = JSON.parse(storedPost);
        displayPost(post);
    }
};

function displayPost(post) {
    var tableBody = document.querySelector('.content table tbody');
    var row = document.createElement('tr');
    row.innerHTML = "<td>" + post.title + "</td><td>" + post.content + "</td><td>" + new Date().toLocaleDateString() + "</td>";
    tableBody.appendChild(row);
}