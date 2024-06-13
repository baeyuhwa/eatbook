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

    var storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
        var posts = JSON.parse(storedPosts);
        displayPosts(posts);
    }

    var postId = localStorage.getItem('selectedPostId');
    if (postId) {
        var storedPosts = localStorage.getItem('qnaPosts'); // 'newPosts' 대신 'qnaPosts'로 수정
        if (storedPosts) {
            var posts = JSON.parse(storedPosts);
            var post = posts[postId];
            if (post) {
                document.getElementById('postTitle').innerText = post.title;
                document.getElementById('postDate').innerText = post.date;
                document.getElementById('postContent').innerText = post.content;

                // 댓글 입력 버튼에 이벤트 추가
                document.getElementById('commentButton').addEventListener('click', function() {
                    var commentInput = document.getElementById('commentInput').value;
                    if (commentInput.trim() !== '') {
                        // 사용자 이름과 시간, 날짜 생성
                        var userName = "사용자 이름"; // 여기에 사용자 이름을 가져오는 코드를 작성
                        var currentDate = new Date();
                        var commentDateTime = currentDate.toLocaleString();

                        // 새로운 댓글 생성
                        var comment = document.createElement('div');
                        comment.classList.add('comment');

                        // 댓글 내용에 사용자 이름과 시간, 날짜 추가
                        var commentContent = `
                            <span class="user-name">${userName}</span>
                            <span class="comment-date">${commentDateTime}</span>
                            <p>${commentInput}</p>
                        `;
                        comment.innerHTML = commentContent;

                        // 댓글 목록에 추가
                        document.getElementById('commentList').appendChild(comment);

                        // 입력 필드 비우기
                        document.getElementById('commentInput').value = '';
                    }
                });
            } else {
                console.error("Post not found");
            }
        } else {
            console.error("No posts found in localStorage");
        }
    } else {
        console.error("No post ID found in localStorage");
    }
});

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
