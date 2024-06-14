function saveQnaPost(event) {
    event.preventDefault();
    var title = document.getElementById('title').value;
    var content = document.getElementById('content').value;
    console.log("제목:", title); // 확인용
    console.log("내용:", content); // 확인용
    var date = new Date().toLocaleDateString();
    var post = { title: title, content: content, date: date };
    
    var storedPosts = localStorage.getItem('qnaPosts');
    console.log("이전 게시물:", storedPosts); // 확인용
    var posts = storedPosts ? JSON.parse(storedPosts) : [];
    
    posts.push(post);
    
    localStorage.setItem('qnaPosts', JSON.stringify(posts));
    
    window.location.href = '9_communication.html';
}
