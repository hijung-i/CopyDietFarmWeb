$(function () {
    getStandDatas();
    getCategory();
    listenForLikes();
});

function listenForLikes (){
    var like = document.querySelectorAll("like");
    like.forEach(like => {
     like.addEventListener("click", (event) => {
       event.target.classList.toggle("like-no");
       event.target.classList.toggle("like-yes");
       if (event.target.classList.contains("like-yes")) {
        console.log("✅💾 Saving Favorite...");
        getFaveData(event.target);
      } else {
        console.log("❌ Removing Favorite...");
        getFaveData(event.target);
      }
    })
   });
  }
  
function getStandDatas() {
    var param = {};
    var option = {
        isRequired: false,
        userId: true
    };

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
                    html += '<div class="like">' + listenForLikes() + '</div>';
                    html += '<div><a href="/product/"><img src="' + RESOURCE_SERVER + product.url+'"></a></div>';
                }
                break;
            case 1:
                var html = '';
                for(var j = 0; j < products.length; j++){
                    var product = products[j];
                    html += '<li>'                  
                    html += '<a href="/product/'+ product.productCode +'"><img src="'+RESOURCE_SERVER + product.url+'">';
                    html += '<p class="title">' + product.productName + '</span><br>';
                    html += '<li class="sale">' + numberFormat(product.discountPrice) + '원</li>';
                    html += '<li class="cost">' + numberFormat(product.supplyPrice) + '원</li>';
                    html += '<li class="ratio">' + Math.round(product.discountRate, 0) + '%</li>';
                    html += '</ul>';
                    html += '</a>';
                    html += '</li>';
                }
                $('.multiple_bxslider').html(html);
                $('.multiple_bxslider').bxSlider({
                        mode: 'horizontal',
                        auto: true,
                        slideWidth: 4000,
                        infiniteLoop: true,
                        controls: true,
                        pager: false,
                        minSlides: 3,
                        maxSlides: 6,
                        slideMargin: 4,
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
                // 당충전이 필요할 때!
                $('.sweet ul').html(generateHtmlForProductList(products, 8));
                $('.sweet h3').html(salesName);
                break;
            case 5:
                // 수분이 필요할 때!
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
        
     }, function(err){
        console.log("onError", err);
    }, option);
};

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

  // 멀티플 슬라이드 
  var slides = document.querySelector('.multiple_slides'),
        slide = document.querySelectorAll('.multiple_slides li'),
        currentIdx = 0,
        slideCount = slide.length,
        prevBtn = document.querySelector('.prev'),
        slideWidth = 350,
        slideMargin = 15,
        nextBtn = document.querySelector('.next');

        slides.style.width = (slideWidth + slideMargin)*slideCount - slideMargin + 'px';

        function moveSlide(num) {
            slides.style.left = -num * 365 + 'px';
            currentIdx = num;
        }
        nextBtn.addEventListener('click', function() {
            if(currentIdx < slideCount - 11) {
                moveSlide(currentIdx + 1);
                console.log(currnetIdx);
            } else {
                moveSlide(0);
            }
        });
        prevBtn.addEventListener('click', function() {
            if(currentIdx > 0) {
                moveSlide(currentIdx - 1);
                console.log(currnetIdx);
            } else {
                moveSlide(slideCount - 11);
            }
        });
        
