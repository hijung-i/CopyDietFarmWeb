$(function () {
    getStandDatas();
    listenForLikes();
});

var app = new Vue({
    el: 'main',
    data: {
    },
    components: {
        'install-modal': installAppModal,
        'mypage-modal': signModal
    }, computed: {
        installModal: function() {
            userAgent = window.navigator.userAgent.toLowerCase()
        
            iOS = /iphone|ipod|ipad/.test(userAgent);
            isBrowser = /chrome|ie|msie|chromium|safari|opr|opera|seamonkey|firefox/.test(userAgent);
    
            if(iOS && isBrowser && $('html').width() <= 1079) {
                scrollBlock();
                return true;
            }

            scrollAllow();
            return false;
        }

    }
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
    , function(data) {
        
        var result = data.result;
        console.log(result);
        for(var i = 0; i < result.salesStands.length; i++){
            var products = result.products[i];
            var salesName = result.salesStands[i];
            switch(i){
            case 0:
                var html = '';
                for(var j = 0; j < products.length; j++){
                    var product = products[j];
                    html += '<div class="swiper-slide"><div class="background" style="background:url('+ RESOURCE_SERVER + product.url +') center"></div><a href="/product/'+ product.productCode +'""><img src="'+RESOURCE_SERVER + product.url +'" alt="'+(j+1)+'/'+ products.length+'"></a></div>';
                    // 메인 슬라이드
                }

                $('.main_slider').html(html);
                
                var swiper = new Swiper(".mySwiper", {
                    pagination: {
                        el: ".swiper-pagination",
                        type: "fraction"
                    },
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev"
                    },
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction:true
                    },
                    loop:true
                });

                break;
            case 1:
                var html = generateHtmlForProductList(products);
                
                $('.responsive').html(html);
                $('.responsive').slick({
                    dots: false,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay:false,
                    autoplaySpeed:3000,
                    pauseOnHover:true,
                    arrow:true,
                    responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 360,
                        settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                        }
                    }

                    ]
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
        console.log('clear')
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
    
    $(document).ready(function(){

        var navHeight = $("html,body").height(); 
    
        $("#goingTo_top").hide();
    
        $(window).scroll(function(){ 
            var rollIt = $(this).scrollTop() >= navHeight; 
    
        if(rollIt){ 
                $("#goingTo_top").show().css({"position":"fixed"});
            }
            else{
                $("#goingTo_top").hide();
            }
        });
        
    });

    // // 멀티플 슬라이드 
    // var slides = document.querySelector('.multiple_slides'),
    // slide = document.querySelectorAll('.multiple_slides li'),
    // currentIdx = 0,
    // slideCount = slide.length,
    // prevBtn = document.querySelector('.prev'),
    // slideWidth = 350,
    // slideMargin = 15,
    // nextBtn = document.querySelector('.next');


    // function moveSlide(num) {
    //     slides.style.left = -num * 365 + 'px';
    //     currentIdx = num;
    // }

    // nextBtn.addEventListener('click', function() {
    //     if(currentIdx < slideCount - 11) {
    //         moveSlide(currentIdx + 1);
    //         console.log(currnetIdx);
    //     } else {
    //         moveSlide(0);
    //     }
    // });
    // prevBtn.addEventListener('click', function() {
    //     if(currentIdx > 0) {
    //         moveSlide(currentIdx - 1);
    //         console.log(currnetIdx);
    //     } else {
    //         moveSlide(slideCount - 11);
    //     }
    // });
});

