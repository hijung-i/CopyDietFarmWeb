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

                $('.bxslider').html(html);

                $('.bxslider li').bxSlider({
                    mode: 'horizontal',
                    auto: true,
                    pause: 6000,
                    controls: false,
                    easing: '',
                    pager: false,
                    touchEnabled: true,
                });
                
                break;
            case 1:
                var html = '';
                for(var j = 0; j < products.length; j++){
                    var product = products[j];
                    html += '<li>'
                    html += '<a href="/product/'+ product.productCode +'"><img src="'+RESOURCE_SERVER + product.url+'">';
                    html += '<p class="title">' + product.productName + '</span><br>';
                    html += '<ul>';
                    html += '<li class="sale">' + numberFormat(product.discountPrice) + '원</li>';
                    html += '<li class="cost">' + numberFormat(product.supplyPrice) + '원</li>';
                    html += '<li class="ratio">' + product.discountRate + '%</li>';
                    html += '</ul>';
                    html += '</a>';
                    html += '</li>';
                   
                }

                $('.multiple_bxslider').html(html);
                $('.multiple_bxslider').bxSlider({
                        mode: 'horizontal',
                        auto: true,
                        slideWidth: 400,
                        infiniteLoop: true,
                        controls: true,
                        pager: false,
                        minSlides: 4,
                        maxSlides: 5,
                        slideMargin: 3,
                        touchEnabled: true
                    });
                break;
            case 2:
                // 위클리 베스트
                $('.w_best ul').html(generateHtmlForProductList(products, 8));
                $('.w_best h2').html(salesName);
                break;
            case 3:
                // 단백질이 필요할 때!
                $('.protein ul').html(generateHtmlForProductList(products, 8));
                $('.protein h3').html(salesName);
                break;
            case 4:
                // 당충전이 필요할 떄!
                $('.sweet ul').html(generateHtmlForProductList(products, 8));
                $('.sweet h3').html(salesName);
                break;
            case 5:
                // 수분이 필요할 떄!
                $('.water ul').html(generateHtmlForProductList(products, 8));
                $('.water h3').html(salesName);
                break;
            case 6:
                // 위클리 베스트 웹
                $('.m_bestn_w').html(generateHtmlForProductList(products, 8));
                $('.m_bestn_w h2').html(salesName);
                break;
            };
        };
        
        $('.slider').bxSlider();
        $('.bxslider').bxSlider({
            mode: 'fade',
            auto: true,
            pause: 2000,
            controls: false,
            easing: 'swing',
            pager: false,
            touchEnabled: true,
        });

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

/* 모바일 메인페이지 슬라이드 메뉴 카테고리 lnb 언더바 애니메이션 */
$(document).ready(function(){
    $('.tabMenu li').on('click',function(){
        $(this).addClass('on');
        $(this).siblings().removeClass('on');
    });
});

/* 맨 위로 이동 */
$(function(){
    $('#goingTo_top').on('click',function(e){
        e.preventDefault();
        $('html,body').animate({scrollTop:0},600);
    });
  });
