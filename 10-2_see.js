window.onload = function() {
    var postId = localStorage.getItem('selectedPostId');
    if (postId !== null) {
        var storedPosts = localStorage.getItem('qnaPosts');
        if (storedPosts) {
            var posts = JSON.parse(storedPosts);
            displayPostDetail(posts[postId]);
        }
    }
    displayComments(); // 댓글을 로드하는 함수 호출
};

function displayPostDetail(post) {
    document.getElementById('postTitle').innerText = post.title;
    document.getElementById('postDate').innerText = post.date;
    document.getElementById('postContent').innerText = post.content;

    // 댓글 입력 버튼에 이벤트 추가
    document.getElementById('commentButton').addEventListener('click', function() {
        var commentInput = document.getElementById('commentInput').value;
        if (commentInput.trim() !== '') {
            // 새로운 댓글 생성
            var comment = document.createElement('div');
            comment.classList.add('comment');

            // 사용자 이름과 시간, 날짜를 포함한 댓글 내용 생성
            var currentDate = new Date();
            var commentContent = `
                <span class="user-name">${userName}</span>
                <span class="comment-date">${currentDate.toLocaleString()}</span>
                <p>${commentInput}</p>
            `;
            comment.innerHTML = commentContent;

            // 댓글 목록에 추가
            document.getElementById('commentList').appendChild(comment);

            // 입력 필드 비우기
            document.getElementById('commentInput').value = '';
        }
    });
}

function displayComments() {
    // 여기에 댓글을 로드하는 코드 작성
}
