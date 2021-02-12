if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    const purchase_buttons = document.getElementsByClassName('btn-purchase')
    for (var i = 0; i < purchase_buttons.length; i++) {
        purchase_buttons[i].addEventListener('click', purchaseClicked)
    }
    var cartItems = document.querySelector('.cart-items')
    if (!cartItems) {
        return null
    }
    var cart_items = JSON.parse(localStorage.getItem('cart_items')) || []
    for (var i = 0; i < cart_items.length; i++) {
        item = cart_items[i]
        var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${item.imageSrc}" width="100" height="100">
            <span class="cart-item-title">${item.title}</span>
        </div>
        <span class="cart-price cart-column">${item.price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
        var cartRow = document.createElement('div')
        cartRow.classList.add('cart-row')
        cartRow.innerHTML = cartRowContents
        console.log(cartItems)
        cartItems.appendChild(cartRow)
        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    }
    updateCartTotal()

}

function purchaseClicked() {
    alert('Thank you for your purchase')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    var parentDom = buttonClicked.parentElement.parentElement
    var name = parentDom.querySelector('.cart-item-title').innerText
    parentDom.remove()
    var cart_items = JSON.parse(localStorage.getItem('cart_items'))
    var cart_items = cart_items.filter(item => item.title !== name)
    localStorage.setItem('cart_items', JSON.stringify(cart_items))

    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)

    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {

    var cart_items = JSON.parse(localStorage.getItem('cart_items')) || []
    if (cart_items.map(x => x['title']).includes(title)) {
        alert(title + ' is already added')
        return
    }
    cart_items.push({
        title,
        imageSrc,
        price
    })
    localStorage.setItem('cart_items', JSON.stringify(cart_items))

}

function updateCartTotal() {
    var cart_items = JSON.parse(localStorage.getItem('cart_items')) || []
    const total = cart_items.map(x => parseFloat(x.price.replace('$', ''))).reduce((x, y) => x + y, 0)
    const total_price = document.querySelector('.cart-total-price')
    total_price.innerHTML = total + ' $'

}