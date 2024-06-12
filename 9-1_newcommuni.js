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

    // 게시글 목록을 업데이트하여 표시
    updatePostList();

    // 폼 초기화
    document.getElementById('communicationForm').reset();
}

function updatePostList() {
    const postList = document.getElementById('postList');
    postList.innerHTML = ''; // 목록 초기화

    // 저장된 게시글 목록 가져오기
    let posts = localStorage.getItem('posts');
    posts = posts ? JSON.parse(posts) : [];

    // 게시글 목록을 테이블에 추가
    posts.forEach((post, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${post.title}</td>
            <td>${post.date}</td>
            <td><button class="delete-button" onclick="deletePost(${index})">삭제</button></td>
        `;
        postList.appendChild(row);
    });
}

function deletePost(index) {
    let posts = localStorage.getItem('posts');
    posts = posts ? JSON.parse(posts) : [];
    posts.splice(index, 1); // 해당 인덱스의 게시글 삭제
    localStorage.setItem('posts', JSON.stringify(posts));
    updatePostList(); // 게시글 목록 업데이트
}

// 페이지 로드 시 게시글 목록 초기화
document.addEventListener('DOMContentLoaded', updatePostList);
