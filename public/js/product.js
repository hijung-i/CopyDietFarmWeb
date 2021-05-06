var product = {};
var selectedOptions = new Array();

$(function() {

    getProductDetail();

    $('ul.tab_wrap li').click(function() {
        var activeTab = $(this).attr('data-tab');
        $('.tab_wrap li').removeClass('active');
        $('.tab_cont').removeClass('active');
        $(this).addClass('active');
        $('#' + activeTab).addClass('active');
    })

    $("select#products").change(function() {
        onOptionSelected($(this));
    });

    $("button.c_btn").click(addCart);

})

function getProductDetail(){
    var productCode = $("#productCode").val();

    var params = {
        productCode: productCode
    }

    ajaxCallWithLogin(API_SERVER + '/product/getProductDetail', params, 'POST'
    , function (data) {
        product = data.result;
        if(product == undefined || product.length == 0){
            // TODO: Open alert modal
            return false;
        }
        console.log(product);
        
        // 상품명
        $('.detail_title h2').html(product.productName);
        $('.v_top_name').html(product.productName);
        $('.infoArea01 .product_name_css .con span').html(product.productName);

        // 가격 정보
        var productDesc = $('.v_top_txt')
        var discountPrice = $('.v_top_txt_box .p1')
        var retailPrice = $('.v_top_txt_box .p2')
        var discountRate = $('.v_top_txt_box .p3')
        productDesc.html(product.productDesc);
        discountPrice.html(numberFormat(product.discountPrice)+'원');
        
        if(product.discountPrice != product.retailPrice){
            retailPrice.html(numberFormat(product.retailPrice)+'원');
            discountRate.html(numberFormat(Math.round(product.discountRate, 0))+'%');
        } else {
            $('.v_top_txt_box .p1').hide()
            $('.v_top_txt_box .p3').hide();
        }

        // v_n_top_info
        $(".v_n_top_info .point .ex").html()
        $(".v_n_top_info .courier-name .ex").html(product.deliveryCompany);
        
        var deliveryCostHtml = '';
        if(product.deliveryCostBasis == 0){
            deliveryCostHtml = '무료배송';
        } else if(product.deliveryCostBasis < 999999) {
            deliveryCostHtml = numberFormat(product.deliveryCostBasis)+'원 이상 구매시 무료배송';
        } else {
            deliveryCostHtml = numberFormat(product.deliveryCost); 
            if(product.deliveryCost3 != 0) {
                deliveryCostHtml += ' ~ ' + numberFormat(product.deliveryCost3) + '원';
            }
        }
        $('.v_n_top_info .delivery-cost .ex').html(deliveryCostHtml);

        var packingTypeHtml = '';
        if (product.packingType == 'A') packingTypeHtml = '상온 (종이박스)';
        else if (product.packingType == 'B') packingTypeHtml = '냉장 (아이스박스)';
        $('.v_n_top_info .packing-type .ex').html(packingTypeHtml);


        var optionHtml = '';
        for(var i = 0; i < product.options.length; i++){
            var option = product.options[i];
            optionHtml += '<option value="' + i +'" '+ ((i==0)?'selected':'')+'>'+ option.optionDesc;
            optionHtml += '</option>';
        }
        $('select#products').html(optionHtml);
        $('select#products').trigger("change");

        var detailHtml = '';
        for(var i = 0; i < product.detail.length; i++){
            var image = product.detail[i];
            detailHtml += '<img src="'+ RESOURCE_SERVER + image.url +'" style="width:100%;height:100%">';
        }
        
        var representative = '';
        console.log(product.representative);
        for(var i = 0; i < product.representative.length; i++){
            var image = product.representative[i];
            representative += '<div><a href="/product/"><img src="' + RESOURCE_SERVER + product.url+'" style="width:100%;"></a></div>';
        }
   
        $('.view_top_box #slider_main').html(representative);
        $('.products_ex').html(detailHtml);
        $('.products_ex_mobile').html(detailHtml);

        
    }, function (err) {
        console.log("productDetail error", err);
    }, {
        isRequired: false,
        userId : true
    })
}

function addCart() {
    console.log(selectedOptions);
    var params = {
        options: selectedOptions
    }

    ajaxCallWithLogin(API_SERVER + '/order/addCart', params, 'POST',
    function(data) {
        alert("장바구니에 추가되었습니다.");
        console.log("addCart success", data);
    }, function(err) {
        if(err.responseText == 'NOT_MATCHED') {
            alert("이미 장바구니에 해당 옵션이 존재합니다.");
        } else {
            alert("장바구니 추가에 실패했습니다.");
        }
        console.log("addCart error", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function onOptionSelected(element) {
    var selectedIndex = $(element)[0].options.selectedIndex;
    var selectedOption = product.options[selectedIndex];

    // 깊은 복사
    var option = JSON.parse(JSON.stringify(selectedOption));
    option.optionCount = 1;

    if(!isExistsInArray(option)) selectedOptions.push(option);

    drawSelectedOptions();
}

function isExistsInArray(option) {
    for(var i =0; i < selectedOptions.length; i++){
        if(option.optionDesc == selectedOptions[i].optionDesc) {
            return true;
        }
    }
    return false;
}

function changeOptionCount(plus, index) {
    var optionCount = selectedOptions[index].optionCount;
    if(plus) {
        optionCount ++;
    } else {
        if((optionCount - 1) <= 0) {
            alert('옵션은 1개 이상 선택해야합니다.');
            optionCount = 1;
        } else {
            optionCount -= 1;
        }
    }
    selectedOptions[index].optionCount = optionCount;
    console.log(selectedOptions[index]);
    drawSelectedOptions();
}

function getSelectedOptionIndex(ele) {
    var optionBox = ele.parent().parent().parent().parent();
    var id = $(optionBox).find(".product_title").attr("id");
    return id.substring('seq_'.length);
}

function drawSelectedOptions() {

    var html = '';
    for(var i = 0; i < selectedOptions.length; i++) {
        var option = selectedOptions[i];
        var optionHtml = '';
        optionHtml += '<div>';
        optionHtml += '<div class="product_count">';
        optionHtml +=        '<div class="product_title" id="seq_'+ i +'">';
        optionHtml +=            '<h4>'+ option.optionDesc +'</h4>';
        optionHtml +=            '<ul>';
        optionHtml +=                '<ii><img src="/images/x_icon_login.png" style="width:8px"></ii>';
        optionHtml +=            '</ul>';
        optionHtml +=        '</div>';
        optionHtml +=        '<div class="number_price">';
        optionHtml +=            '<div class="number-input">';
        optionHtml +=                '<button class="minus"></button>';
        optionHtml +=                '<input class="quantity" min="1" name="quantity" value="'+ option.optionCount +'" type="number">';
        optionHtml +=                '<button class="plus"></button>';
        optionHtml +=           ' </div>';
        optionHtml +=            '<p>'+ numberFormat(option.optionDiscountPrice * option.optionCount) +'원</p>';

        // 총 금액은 여기서 안보여줌
        // optionHtml +=            '<div class="t_price">';
        // optionHtml +=                '<ul>';\
         CDVFJ;       // optionHtml +=                    '<li class="total">총 금액</li>';
        // optionHtml +=                    '<li>8,500원</li>';
        // optionHtml +=               ' </ul>';
        // optionHtml +=            '</div>';

        optionHtml +=       ' </div>';
        optionHtml +=   ' </div>';
        optionHtml += '</div>';

        html += optionHtml;
    }

    $('#selectedOptionDiv').html(html);

    $('.number-input .minus').click(function() {
        var seq = getSelectedOptionIndex($(this));

        changeOptionCount(false, seq);
    })
    $('.number-input .plus').click(function() {
        var seq = getSelectedOptionIndex($(this));

        changeOptionCount(true, seq);
    })

    $('.product_title img').click(function() {
        var seq = getSelectedOptionIndex($(this));
        selectedOptions.splice(seq, 1);

        drawSelectedOptions();
    });


}