$(function() {
    getProductDetail();
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
        $('.detail_title h2').html(product.productName);    
        $('.product_wrap .product h2').html(product.productName);
        $('.infoArea01 .product_name_css .con span').html(product.productName);

        $('.infoArea01 .simple_desc_css .con span span').html(product.productDesc);
        $('.infoArea01 .product_custom .con span span').html(numberFormat(product.discountPrice)+'원');
        $('.infoArea01 .product_price .con strike').html(numberFormat(product.supplyPrice)+'원');
        $('.infoArea01 .discount_rate .con strong').html(numberFormat(product.discountRate)+'%');

        var optionHtml = '';
        for(var i = 0; i < product.options.length; i++){
            var option = product.options[i];
            optionHtml += `<option value="${option.optionCode}">${option.optionDesc}</option>`;
        }
        $('select optgroup').html(optionHtml);
        var detailHtml = '';
        for(var i = 0; i < product.detail.length; i++){
            var image = product.detail[i];
            detailHtml += `<img src="${RESOURCE_SERVER + image.url}" style="width:100%;height:100%">`
        }
        
        $('.products_ex').html(detailHtml);
        console.log("productDetail success", data);
    }, function (err) {
        console.log("productDetail error", err);
    }, {
        isRequired: false,
        userId : true
    })
}