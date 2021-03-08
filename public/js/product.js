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

        var productName = $('.product_wrap .product h2')
        productName.html(product.productName);
        $('.infoArea01 .product_name_css .con span').html(product.productName);

        var productDesc = $('.infoArea01 .simple_desc_css .con span')
        var discountPrice = $('.infoArea01 .product_custom .con span span')
        var supplyPrice = $('.infoArea01 .product_price')
        var discountRate = $('.infoArea01 .discount_rate')
        productDesc.html(product.productDesc);
        discountPrice.html(numberFormat(product.discountPrice)+'원');
        
        if(product.discountPrice != product.supplyPrice){
            supplyPrice.find('.con strike').html(numberFormat(product.supplyPrice)+'원');
            discountRate.find('.con strong').html(numberFormat(product.discountRate)+'%');
        } else {
            $('.infoArea01 .product_price').hide()
            $('.infoArea01 .discount_rate').hide();
        }

        var optionHtml = '';
        for(var i = 0; i < product.options.length; i++){
            var option = product.options[i];
            optionHtml += '<option value="' + option.optionCode +'" '+ ((i==0)?'selected':'')+'>'+ option.optionDesc+'</option>';
        }
        $('select#products').html(optionHtml);
        
        var representative = '';
        var detailHtml = '';
        for(var i = 0; i < product.detail.length; i++){
            var image = product.detail[i];
            detailHtml += '<img src="'+ RESOURCE_SERVER + image.url +'" style="width:100%;height:100%">';
        }
        
        // for(var i = 0; i < product.representative.length; i++){
        //     var image = product.representative[i];
        //     representative += '<img'
        // }
        $('.products_ex').html(detailHtml);
        console.log("productDetail success", data);
    }, function (err) {
        console.log("productDetail error", err);
    }, {
        isRequired: false,
        userId : true
    })
}