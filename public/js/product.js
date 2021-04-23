var selectedOptions = new Array();
var 

$(function() {

    getProductDetail();

    $('ul.tab_wrap li').click(function() {
        var activeTab = $(this).attr('data-tab');
        $('.tab_wrap li').removeClass('active');
        $('.tab_cont').removeClass('active');
        $(this).addClass('active');
        $('#' + activeTab).addClass('active');
    })

})

function getProductDetail(){
    var productCode = $("#productCode").val();

    var params = {
        productCode: productCode
    }

    ajaxCallWithLogin(API_SERVER + '/product/getProductDetail', params, 'POST'
    , function (data) {
        var product = data.result;
        if(product == undefined || product.length == 0){
            // TODO: Open alert modal
            return false;
        }
        console.log(product);
        
        var headerTitle = $('.detail_title h2'); 
        headerTitle.html(product.productName);

        var productName = $('.v_top_name')
        productName.html(product.productName);
        $('.infoArea01 .product_name_css .con span').html(product.productName);

        var productDesc = $('.v_top_txt')
        var discountPrice = $('.v_top_txt_box .p1')
        var supplyPrice = $('.v_top_txt_box .p2')
        var discountRate = $('.v_top_txt_box .p3')
        productDesc.html(product.productDesc);
        discountPrice.html(numberFormat(product.discountPrice)+'원');
        
        if(product.discountPrice != product.supplyPrice){
            supplyPrice.find('.con strike').html(numberFormat(product.supplyPrice)+'원');
            discountRate.find('.con strong').html(numberFormat(product.discountRate)+'%');
        } else {
            $('.v_top_txt_box .p1').hide()
            $('.v_top_txt_box .p3').hide();
        }
     
        var optionHtml = '';
        for(var i = 0; i < product.options.length; i++){
            var option = product.options[i];
            optionHtml += '<option value="' + option.optionCode +'" '+ ((i==0)?'selected':'')+'>'+ option.optionDesc+'</option>';
        }
        $('select#products').html(optionHtml);
        
        var detailHtml = '';
        for(var i = 0; i < product.detail.length; i++){
            var image = product.detail[i];
            detailHtml += '<img src="'+ RESOURCE_SERVER + image.url +'" style="width:100%;height:100%">';
        }
        
        var representative = '';
        console.log(product.representative[i]);
        for(var i = 0; i < product.representative.length; i++){
            var image = product.representative[i];
            representative += '<li><a href="#"><img src="'+ RESOURCE_SERVER + image.url+'"></a></li>';
        }

        $('.view_top_box .bxslider').html(representative);
        $('.products_ex').html(detailHtml);

        // v_n_top_info
        $(".v_n_top_info .point .ex").html()
        $(".v_n_top_info .delivery-type .ex").html(product.deliveryCompany);

    }, function (err) {
        console.log("productDetail error", err);
    }, {
        isRequired: false,
        userId : true
    })
}

function Show_hidden(e) {
    var menu = new Array("test_1", "test_2", "test_3", "test_4", "test_5"); // 객체 배열로 지정
    for (var i = 0; i < menu.length; i++) {
        if ("test_" + e == menu[i]) {
            document.all[menu[i]].style.display = "block";
        } else {
            document.all[menu[i]].style.display = "none";
        }
    }
}


$(document).ready(function() {
$('.bxslider').bxSlider({
            mode: 'horizontal',
            auto: false,
            pause: 2000,
            controls: false,
            easing: '',
            pager: false,
            touchEnabled: true,
        });
$('.multiple_bxslider').bxSlider({
    mode: 'horizontal',
    mode: 'horizontal',
    auto: true,
    slideWidth: 3000,
    infiniteLoop: true,
    controls:true,
    pager: false,
    minSlides:4,
    maxSlides:4,
    slideMargin: 10
});

});
$(function() {
$('ul.tab_wrap#tab_mobile li').click(function() {
    var activeTab = $(this).attr('data-tab');
    $('.tab_wrap li').removeClass('active');
    
    
    $('.tab_cont').removeClass('active');
    
    $(this).addClass('active');
    $('#' + activeTab).addClass('active');
})

$('ul.tab_wrap#tab_pc li').click(function() {
    var activeTab = $(this).attr('data-tab');
    $('.tab_wrap li').removeClass('active');
    
    $('.tab_cont').removeClass('active');
    
    $(this).addClass('active');
    $('#' + activeTab).addClass('active');
    
    $('#tab1_mobile').addClass('active');
})
});

