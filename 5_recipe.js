window.onload = function() {
    document.getElementById('search-bar').addEventListener('keyup', function(event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });
}

function performSearch() {
    const searchValue = document.getElementById('search-bar').value;
    localStorage.setItem('searchQuery', searchValue);
    window.location.href = '5_recipe_result.html';
}
