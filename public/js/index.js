$(function () {
    getStandDatas();
    getCategory();
});


function getStandDatas() {
    var param = {};
    var option = {
        isRequired: false,
        userId: true
    }

    ajaxCallWithLogin(API_SERVER + "/product/getSalesStands", param, 'post'
    , function(data){

        var result = data.result;
        for(var i = 0; i < result.salesStands.length; i++){
            var products = result.products[i];
            var salesName = result.salesStands[i];

            switch(i){
            case 0:
                var html = '';
                for(var j = 0; j < products.length; j++){
                    var product = products[j];
                    html += '<li><img src="' + RESOURCE_SERVER + product.url+'"></li>';
                }

                $('.main_img .bxslider').html(html);

                $('.main_img .bxslider').bxSlider({
                    mode: 'fade',
                    auto: true,
                    pause: 2000,
                    controls: false,
                    easing: 'ease-in',
                    pager: false,
                    touchEnabled: true,
                });
                
                break;
            case 1:
                var html = '';
                for(var j = 0; j < products.length; j++){
                    var product = products[j];
                    html += '<li><a href="#">';
                    html += '<img src="'+RESOURCE_SERVER+ product.url+'" style="width:100%">';
                    html += '<span class="title">' + product.productName +'</span><br>';
                    html += '<span class="price">'+ numberFormat(product.discountPrice)+'원</span></a></li>';
                }

                $('.s_price .multiple_bxslider').html(html);
                $('.multiple_bxslider').bxSlider({
                    mode: 'horizontal',
                    auto: true,
                    slideWidth: 3000,
                    infiniteLoop: false,
                    controls: false,
                    pager: false,
                    minSlides: 2.5,
                    maxSlides: 2.5,
                    slideMargin: 10
                });
                break;
            case 2:
                // 위클리 베스트
                $('.w_best ul').html(generateHtmlForProductList(products));
                $('.w_best h2').html(salesName);
                break;
            case 3:
                // 단백질이 필요할 때!
                $('.protein ul').html(generateHtmlForProductList(products));
                $('.protein h2').html(salesName);
                break;
            case 4:
                // 당충전이 필요할 떄!
                $('.sweets ul').html(generateHtmlForProductList(products));
                $('.sweets h2').html(salesName);
                break;
            case 5:
                // 수분이 필요할 떄!
                $('.water ul').html(generateHtmlForProductList(products));
                $('.water h2').html(salesName);
                break;
            }
        }

    }, function(err){
        console.log("onError", err);
    }, option);
};


function getCategory() {
    var param = {};
    ajaxCall(API_SERVER + "/product/getCategoryList", param, 'post'
    , function (data) {
        console.log("getCategory => ", data);
    }, function (err){
        console.log("onError", err);
    })
}