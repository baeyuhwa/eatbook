$(document).ready(function() {
    $('#searchButton').click(function() {
        var foodName = $('#foodName').val(); // 입력된 음식 이름을 가져옵니다.
        if(foodName) {
            // 유효한 음식 이름이 입력되었을 경우, 검색 결과 페이지로 이동합니다.
            var searchUrl = 'https://www.10000recipe.com/recipe/list.html?q=' + encodeURIComponent(foodName);
            window.location.href = searchUrl;
        } else {
            // 음식 이름이 입력되지 않았을 경우, 사용자에게 알립니다.
            alert('한국 음식 이름을 입력해주세요.');
        }
    });
});