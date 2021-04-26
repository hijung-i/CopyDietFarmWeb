var orderDTO = {
    delivery: {},
    deliveryCost: 0,
    totalDeliveryCost: 0,
    products: [{
        options: []
    }]
}

var isJeju = false, isExtra = false;

var deliveryGroupList = new Array();
var cartList = new Array();

$(function() {
    checkDeliveryAddress();
    getCartItemList();

})

function getCartItemList() {
    var params = {};
    ajaxCallWithLogin(API_SERVER + '/order/getCartInfoByUserID', params, 'POST',
    function(data) {
        console.log("get cartInfo success", data);
        cartList = data.result;
        
        drawCartItemList()

    }, function(err) {
        console.log("error while get cartinfo", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function checkDeliveryAddress() {
    var params = {};
    
    ajaxCallWithLogin(API_SERVER + '/user/checkDeliveryAddress', params, 'POST',
    function(data) {
        console.log("success", data);
        var result = data.result;

        if(result.address.includes('제주특별자치도')) {
            isJeju = true;
        } 
        if(result.count > 0) {
            isExtra = true;
        }
    }, function(err) {
        console.log("error", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function drawCartItemList() {
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
            cartItem.totalDeliveryCost += 

            cartItemHtml += '<div class="shoplist_ctn" id="prd_'+ i +'-opt_'+ j +'">';
            cartItemHtml += '<div>';
            cartItemHtml += '    <input type="checkbox" name="optionSelect" '+ ((option.isSelected == true)?'checked':'') +'>';
            cartItemHtml += '</div>';
            cartItemHtml += '<div class="flow-column">';
            cartItemHtml += '    <div class="shopcart_info">';
            cartItemHtml += '        <input type="hidden" name="productCode" value="'+ cartItem.productCode +'">'
            cartItemHtml += '        <div class="shopcart_thum"><img src="'+ RESOURCE_SERVER + cartItem.url +'"></div>';
            cartItemHtml += '        <div class="shopcart_product flow-column">';
            cartItemHtml += '            <div class="flow-column">';
            cartItemHtml += '                <input type="hidden" name="optionCode" value="'+ cartItem.optionCode +'">'
            cartItemHtml += '                <input type="hidden" name="optionDiscountPrice" value="'+ cartItem.optionDiscountPrice +'">'
            cartItemHtml += '                <input type="hidden" name="optionPrice" value="'+ cartItem.optionPrice +'">'
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

        $('section#shplist').html(cartItemHtml);

        cartItemHtml += '<div>';
        cartItemHtml +=     '<table class="detail_price">';
        cartItemHtml +=         '<tr>';
        cartItemHtml +=             '<td><span>상품금액</span></td>';
        cartItemHtml +=             '<td class="price">'+ numberFormat(cartItem.optionTotalPrice) +'</td>';
        cartItemHtml +=         '</tr>';
        cartItemHtml +=         '<tr>';
        cartItemHtml +=             '<td><span>배송비</span></td>';
        cartItemHtml +=             '<td class="price">'+ numberFormat(cartItem.deliveryCost) +'</td>';
        cartItemHtml +=         '</tr>';
        cartItemHtml +=         '<tr>';
        cartItemHtml +=             '<td><span>주문금액</span></td>';
        cartItemHtml +=             '<td class="price">'+ numberFormat(cartItem.optionTotalPrice + cartItem.deliveryCost)+'</td>';
        cartItemHtml +=         '</tr>';
        cartItemHtml +=     '</table>';
        cartItemHtml += '</div>';
        cartItemHtml += '</div>';
        cartItemHtml += '</div>';
        
        cartItemHtml += '<div class="line"></div>';
    }
    $('section#shplist').html(cartItemHtml);
    
    $("button.minus").click(function() {
        var idxes = getSelectedOptionIndexes($(this).parent().parent().parent().parent().parent().parent());
        var pIdx = idxes[0];
        var oIdx = idxes[1];

        changeOptionCount(false, pIdx, oIdx);
    })

    $("button.plus").click(function() {
        var idxes = getSelectedOptionIndexes($(this).parent().parent().parent().parent().parent().parent());
        var pIdx = idxes[0];
        var oIdx = idxes[1];

        changeOptionCount(true, pIdx, oIdx);
    })

    $("[name=optionSelect]").change(function() {
        console.log("change");
        var id = getSelectedOptionIndexes($(this).parent().parent());
        var pIdx = id[0], oIdx = id[1];
        
        orderDTO.products[pIdx].options[oIdx].isSelected = $(this).checked;
        console.log(orderDTO.products);
    })

    
}

function getSelectedOptionIndexes(ele) {
    var id = $(ele).attr("id").split("-");

    var prd = id[0].substring('prd_'.length);
    var opt = id[1].substring('opt_'.length);
    
    return [prd, opt];
}

function changeOptionCount(plus, pIdx, oIdx) {
    if(plus) {
        cartList[pIdx].options[oIdx].optionCount += 1
    } else {
        if(cartList[pIdx].options[oIdx].optionCount <= 1) {
            alert('최소 수량은 1개입니다.');
            return;
        }
        cartList[pIdx].options[oIdx].optionCount -= 1;   
    }

    drawCartItemList();
}

