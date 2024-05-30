window.onload = function() {
    document.getElementById('search-bar').addEventListener('keyup', function(event) {
        if(event.key == "Enter") {
            performSearch();
        }
    });
}

function performSearch() {
    const searchVlalue = document.getElementById('search-bar').value;
    localStorage.setItem('searchQuery', searchVlalue);
    window.open('5_recipe_result.html', '_blank');
}