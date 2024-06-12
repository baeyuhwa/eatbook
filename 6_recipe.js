document.getElementById('fridge-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var ingredient = document.getElementById('ingredient-name').value;
    var quantity = document.getElementById('ingredient-quantity').value;
    var unit = document.getElementById('ingredient-unit').value;
    var expiration = document.getElementById('expiration-date').value;

    var category = document.querySelector('input[name="category"]:checked').value;
    var list = document.getElementById(category + '-list');

    var listItem = document.createElement('li');
    listItem.textContent = `${ingredient} - ${quantity}${unit} (유통기한: ${expiration})`;

    list.appendChild(listItem);

    document.getElementById('ingredient-name').value = '';
    document.getElementById('ingredient-quantity').value = '';
    document.getElementById('ingredient-unit').selectedIndex = 0;
    document.getElementById('expiration-date').value = '';

    saveFridgeList();
});

function saveFridgeList() {
    var items = {};
    document.querySelectorAll('.ingredient-list').forEach(list => {
        var category = list.id.replace('-list', '');
        items[category] = [];
        list.querySelectorAll('li').forEach(listItem => {
            var itemText = listItem.textContent;
            var [ingredientPart, expirationPart] = itemText.split(' (유통기한: ');
            var ingredientDetails = ingredientPart.split(' - ');
            var ingredient = ingredientDetails[0];
            var quantityUnit = ingredientDetails[1].match(/(\d+)([a-zA-Z]+)/);
            var quantity = quantityUnit[1];
            var unit = quantityUnit[2];
            var expiration = expirationPart.replace(')', '');
            
            var item = {
                ingredient: ingredient,
                quantity: quantity,
                unit: unit,
                expiration: expiration
            };
            items[category].push(item);
        });
    });

    localStorage.setItem('fridgeList', JSON.stringify(items));
}

function loadFridgeList() {
    var items = JSON.parse(localStorage.getItem('fridgeList'));
    if (items) {
        for (var category in items) {
            var list = document.getElementById(category + '-list');
            items[category].forEach(item => {
                var listItem = document.createElement('li');
                listItem.textContent = `${item.ingredient} - ${item.quantity}${item.unit} (유통기한: ${item.expiration})`;

                list.appendChild(listItem);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', loadFridgeList);
