document.addEventListener('DOMContentLoaded', function() {
    const kakaoNickname = localStorage.getItem('kakaoNickname');
    if (kakaoNickname) {
        const userNameElement = document.getElementById('user-name');
        userNameElement.textContent = kakaoNickname;
    }
    loadFridgeList();
    document.getElementById('search-icon').addEventListener('click', function() {
        performSearch();
    });
});

function performSearch() {
    const searchValue = document.getElementById('search-bar').value;
    localStorage.setItem('searchQuery', searchValue);
    window.location.href = '5_recipe_result.html';
}

function loadFridgeList() {
    var list = document.getElementById('fridge-list-items');
    var items = JSON.parse(localStorage.getItem('fridgeList')) || [];

    items.forEach(item => {
        var row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.ingredient}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${item.expiration}</td>
            <td><button class="edit-btn">수정</button></td>
            <td><button class="delete-btn">삭제</button></td>
        `;
        
        list.appendChild(row);

        // 삭제 버튼 이벤트 리스너
        row.querySelector('.delete-btn').addEventListener('click', function() {
            list.removeChild(row);
            saveFridgeList(); // 수정한 부분: 로컬 스토리지에 저장
        });

        // 수정 버튼 이벤트 리스너
        row.querySelector('.edit-btn').addEventListener('click', function() {
            // 입력 필드로 데이터 이동
            document.getElementById('ingredient-name').value = item.ingredient;
            document.getElementById('ingredient-quantity').value = item.quantity;
            document.getElementById('ingredient-unit').value = item.unit;
            document.getElementById('expiration-date').value = item.expiration;
    
            // 수정 모드 활성화
            var index = Array.from(list.children).indexOf(row);
            document.getElementById('fridge-form').setAttribute('data-editing-index', index);
        });
    });
}
