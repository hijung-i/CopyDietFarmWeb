$(function() {
    getCartItemList();
    
})

function getCartItemList() {
    var params = {};
    ajaxCallWithLogin(API_SERVER + '/order/getCartInfoByUserID', params, 'POST',
    function(data) {
        console.log("get cartInfo success", data);
        var cartList = data.result;
        var cartItemHtml = '';

        for(var i = 0; i < cartList.length; i++) {
            var cartItem = cartList[i];

                
            cartItemHtml += '<div class="brand_1">';
            cartItemHtml += '<h3>'+ ((cartItem.brandName != '')?cartItem.brandName:cartItem.companyName) +'</h3>';
            cartItemHtml += '<div class="shoplist_info flow-column">';
            
            cartItem.optionTotalPrice = 0;
            for(var j = 0; j < cartItem.options.length; j++){
                
                var option = cartItem.options[j];
                cartItem.optionTotalPrice += (option.optionDiscountPrice * option.optionCount);
                
                cartItemHtml += '<div class="shoplist_ctn">';
                cartItemHtml += '<div>';
                cartItemHtml += '    <input type="radio" id="shoplist_part_selt">';
                cartItemHtml += '</div>';
                cartItemHtml += '<div class="flow-column">';
                cartItemHtml += '    <div class="shopcart_info">';
                cartItemHtml += '        <div class="shopcart_thum"><img src="'+ RESOURCE_SERVER + cartItem.url +'"></div>';
                cartItemHtml += '        <div class="shopcart_product flow-column">';
                cartItemHtml += '            <div class="flow-column">';
                cartItemHtml += '                <p class="product_name">'+ cartItem.productName+'</p>';
                cartItemHtml += '                <p class="option_desc">'+ option.optionDesc +'</p>';
                cartItemHtml += '                <p class="price_web">'+ numberFormat(option.optionDiscountPrice) +'</p>';
                cartItemHtml += '                <a href="#"><img src="/images/x_icon_login.png" style="width:12px" class="delete_btn"></a>';
                cartItemHtml += '            </div>';
                cartItemHtml += '            <div class="shoplist_count">';
                cartItemHtml += '                <div class="number-input">';
                cartItemHtml += '                    <button class="minus" style="top:-10px"></button>';
                cartItemHtml += '                    <input class="quantity" min="0" name="quantity" value="'+ option.optionCount +'" type="number">';
                cartItemHtml += '                    <button class="plus"></button>';
                cartItemHtml += '                </div>';                                  
                cartItemHtml += '            </div>';
                cartItemHtml += '        </div>';
                cartItemHtml += '    </div>';
                cartItemHtml += '    <div class="p_price">';
                cartItemHtml += '        <p class="product_p"> 상품금액 </p>';
                cartItemHtml += '        <p>'+ numberFormat(option.optionDiscountPrice * option.optionCount) +'원</p>';
                cartItemHtml += '    </div>';
                cartItemHtml += '</div>';
                cartItemHtml += '</div>';
            }

            cartItemHtml += '<div>';
            cartItemHtml +=     '<table class="detail_price">';
            cartItemHtml +=         '<tr>';
            cartItemHtml +=             '<td><span>상품금액</span></td>';
            cartItemHtml +=             '<td class="price">9,900원</td>';
            cartItemHtml +=         '</tr>';
            cartItemHtml +=         '<tr>';
            cartItemHtml +=             '<td><span>배송비</span></td>';
            cartItemHtml +=             '<td class="price">4,000원</td>';
            cartItemHtml +=         '</tr>';
            cartItemHtml +=         '<tr>';
            cartItemHtml +=             '<td><span>주문금액</span></td>';
            cartItemHtml +=             '<td class="price">13,900원</td>';
            cartItemHtml +=         '</tr>';
            cartItemHtml +=     '</table>';
            cartItemHtml += '</div>';
            cartItemHtml += '</div>';
            cartItemHtml += '</div>';
            
            cartItemHtml += '<div class="line"></div>';
        }
        console.log(cartItemHtml);
        $('section#shplist').html(cartItemHtml);

        
        $("button.minus").click(function() {
            changeOptionCount(false, );
        })


    }, function(err) {
        console.log("error while get cartinfo", err);
    }, {
        isRequired: true,
        userId: true
    })
}