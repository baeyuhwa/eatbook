window.onload = function() {
    var storedPosts = localStorage.getItem('qnaPosts');
    if (storedPosts) {
        var posts = JSON.parse(storedPosts);
        displayPosts(posts);
    }
};

function displayPosts(posts) {
    var tableBody = document.getElementById('postList');
    tableBody.innerHTML = '';

    posts.forEach((post, index) => {
        var row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><a href='10-2_see.html' data-id='${index}'>${post.title}</a></td>
            <td>${post.date}</td>
            <td><button class='delete-button' data-id='${index}'>&#10006;</button></td>
        `;
        tableBody.appendChild(row);
    });

    var links = tableBody.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            var id = this.getAttribute('data-id');
            localStorage.setItem('selectedQnaPostId', id);
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
    var storedPosts = localStorage.getItem('qnaPosts');
    if (storedPosts) {
        var posts = JSON.parse(storedPosts);
        posts.splice(id, 1);
        localStorage.setItem('qnaPosts', JSON.stringify(posts));
        displayPosts(posts);
    }
}
