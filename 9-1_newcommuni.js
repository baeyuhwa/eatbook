function savePost(event) {
    event.preventDefault();
    var title = document.getElementById('title').value;
    var content = document.getElementById('content').value;
    var date = new Date().toLocaleDateString();
    var post = { title: title, content: content, date: date };
    var storedPosts = localStorage.getItem('newPosts');
    var posts = storedPosts ? JSON.parse(storedPosts) : [];
    posts.push(post);
    localStorage.setItem('newPosts', JSON.stringify(posts));
    window.location.href = '9_commincation.html';
}