function goToNewRecipePage() {
    // "레시피 만들기" 페이지로 이동하는 기능을 구현합니다.
    // 예를 들어, location.href를 사용하여 해당 페이지로 이동할 수 있습니다.
    // location.href = "7_newrecipe.html";
}

// 통신 관련 데이터를 동적으로 추가하는 함수 예시
// 실제 데이터를 받아와서 이 함수를 호출하여 리스트 아이템을 추가하면 됩니다.
function addCommunicationListItem(data) {
    var list = document.getElementById("communication-list");
    var listItem = document.createElement("li");
    listItem.textContent = data;
    list.appendChild(listItem);
}

// 통신 관련 데이터를 받아오고 리스트에 추가하는 예시
// 실제로는 서버와의 통신을 통해 데이터를 받아와야 합니다.
// 이 예시에서는 setTimeout 함수를 사용하여 1초 후에 데이터를 받아온다고 가정합니다.
setTimeout(function() {
    var mockData = ["소통 내용 1", "소통 내용 2", "소통 내용 3"];
    mockData.forEach(function(item) {
        addCommunicationListItem(item);
    });
}, 1000);
