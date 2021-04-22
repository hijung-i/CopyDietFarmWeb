function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('product_name')[0].innerText
    var price = shopItem.getElementsByClassName('price_web')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shopcart_thum')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('shoplist_info')
    var cartItems = document.getElementsByClassName('shoplist_ctn')[0]
    var cartItemNames = cartItems.getElementsByClassName('product_name"')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('이미 담겨 있는 상품입니다.')
            return
        }
    }
    var cartRowContents = '<div class="shoplist_info">';
    cartRowContents += '<div class="shoplist_ctn">';
        <input type="radio" id="shoplist_part_selt">
        <div class="shopcart_thum">
            <!--<img src="./images/shopcart_thum.jpg" alt="쇼핑썸네일"> -->
        </div>
        <p class="product_name"></p>
        <a href="#"><img src="/images/x_icon_login.png" style="width:12px" class="delete_btn"></a>
    </div>
    <div class="shoplist_price_web">
        <div class="shoplinst_count">
            <p>라이트밀 도시락 5종</p>
            <div class="number-input">
                <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" class="minus" style="top:-10px"></button>
                <input class="quantity" min="0" name="quantity" value="1" type="number">
                <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" class="plus"></button>
            </div>
            <div class="price_web">
                60,720원
            </div>
        </div>
     </div>
</div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('delete_btn')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('quantity')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('quantity')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('price_web')[0]
        var quantityElement = cartRow.getElementsByClassName('quantity')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('total_mobile')[0].innerText = '$' + total
}