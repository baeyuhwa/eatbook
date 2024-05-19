<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>게시물 작성</title>
</head>
<body>
    <form id="postForm" onsubmit="return submitPost();">
        <div>
            <label for="title">제목:</label>
            <input type="text" id="title" name="title">
        </div>
        <div>
            <label for="content">내용:</label>
            <textarea id="content" name="content"></textarea>
        </div>
        <div>
            <button type="submit">게시물 저장</button>
        </div>
    </form>

    <script>
        function savePost(title, content) {
            var posts = JSON.parse(localStorage.getItem("posts")) || [];
            posts.push({ title: title, content: content });
            localStorage.setItem("posts", JSON.stringify(posts));
        }
        function submitPost() {
            var title = document.getElementById("title").value;
            var content = document.getElementById("content").value;
            savePost(title, content);
            // communication.html의 목록을 업데이트
            parent.loadPosts();
            // 작성한 게시물이 저장된 페이지로 이동
            window.location.href = "9_communication.html";
            return false; // form 기본 동작 방지
        }
    </script>
</body>
</html>
