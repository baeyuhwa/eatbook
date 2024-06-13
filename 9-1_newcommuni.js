document.addEventListener('DOMContentLoaded', function() {
    const kakaoNickname = localStorage.getItem('kakaoNickname');
    if (kakaoNickname) {
        const userNameElement = document.getElementById('user-name');
        userNameElement.textContent = kakaoNickname;
    }
});

function performSearch() {
    const searchValue = document.getElementById('search-bar').value;
    localStorage.setItem('searchQuery', searchValue);
    window.location.href = '5_recipe_result.html';
}

function savePost(event) {
    event.preventDefault(); // 폼 기본 동작 방지

    // 제목과 내용 가져오기
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    // 저장된 게시글 목록을 가져오기
    let posts = localStorage.getItem('posts');
    posts = posts ? JSON.parse(posts) : [];

    // 새로운 게시글 추가
    const newPost = {
        title: title,
        content: content,
        date: new Date().toLocaleDateString() // 작성일 추가
    };
    posts.push(newPost);

    // 변경된 게시글 목록을 로컬 스토리지에 다시 저장
    localStorage.setItem('posts', JSON.stringify(posts));

    // 폼 초기화 후 게시글 목록 페이지로 이동
    document.getElementById('communicationForm').reset();
    window.location.href = '9_communication.html';
}
function savePost(event) {
    event.preventDefault();
    var title = document.getElementById('title').value;
    var content = document.getElementById('content').value;
    var date = new Date().toLocaleDateString();

    var newPost = { title: title, content: content, date: date };
    var storedPosts = localStorage.getItem('posts');
    var posts = storedPosts ? JSON.parse(storedPosts) : [];
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    window.location.href = '9_communication.html';
}
