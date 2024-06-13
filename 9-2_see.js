
    document.addEventListener('DOMContentLoaded', function() {
        const kakaoNickname = localStorage.getItem('kakaoNickname');
        if (kakaoNickname) {
            const userNameElement = document.getElementById('user-name');
            userNameElement.textContent = kakaoNickname;
        }
    });

    window.onload = function() {
        var postId = localStorage.getItem('selectedPostId');
        if (postId) {
            var storedPosts = localStorage.getItem('posts'); // Ensure the key matches with `9_communication.html`
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
    }
