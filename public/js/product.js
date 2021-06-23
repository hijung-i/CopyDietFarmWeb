
var selectedOptions = new Array();
var isExtra = false, isJeju = false;

var app = new Vue({
    el: 'main',
    data: {
        RESOURCE_SERVER,
        selectedOptions,
        product: {},
        optionTotalPrice: 0,
        orderDTO: {},
        deliveryGroupList: [],
        reviewList: [],
        questionList: [],
        recmdList: []
    }, methods: {
        numberFormat,
        deleteFromArray,
        changeOptionCount,
        formatDate,
        onSubmit: function() {
            if(app.selectedOptions != undefined && app.selectedOptions.length > 0) {
                location.href="/order?deliveryGroupList=" + JSON.stringify(app.deliveryGroupList)+'&orderDTO='+ JSON.stringify(app.orderDTO);
            } else {
                alert('상품을 선택해주세요');
            }
        },
        onOptionSelected,
        zzimProduct,
    }
});

$(function() {
    getProductDetail();

    $("button.c_btn").click(addCart);
    $('button.cart').click(addCart);

    /* 모바일 제품상세 탭메뉴 lnb 언더바 애니메이션 */
    $('div.pdt_detai_tabinner_vn li').on('click',function(){
        $(this).addClass('onTab');
        $(this).siblings().removeClass('onTab');
    });
    
    ajaxCall('/user/login', {}, 'GET', 
    function( data ){
        console.log("data", data);
        if(data.result.isLoggedIn == true) {
            checkDeliveryAddress();
        }
    }, function(err) {
        console.log("error", err);
    })

    
})

function getProductDetail(){
    var productCode = $("#productCode").val();

    var params = {
        productCode: productCode
    }
    if(productCode == undefined ) {
        // setTimeout(getProductDetail, 100);
        return;
    }
    ajaxCallWithLogin(API_SERVER + '/product/getProductDetail', params, 'POST'
    , function (data) {
        var product = data.result;
        app.product = product;

        var html = '';
        for(var i = 0; i < product.representative.length; i++ ) {
            var image = product.representative[i];
            html += '<div class="swiper-slide"><img src="'+ RESOURCE_SERVER + image.url + '" alt=""></div>';
        }

        $('.productSwiper .swiper-wrapper').html(html);
        var swiper = new Swiper(".productSwiper", {
            pagination: {
                el: ".swiper-pagination",
                type: "fraction"
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            }
        });
        
        

        if(app.product == undefined || app.product == 0){
            // TODO: Open alert modal
            return false;
        }

        if(product.options.length == 1) {
            app.selectedOptions = JSON.parse(JSON.stringify(product.options));
            app.selectedOptions[0].optionCount = 1;
            app.selectedOptions[0].isSelected = true;
            drawSelectedOptions();
        }

        app.product.discountRate = Math.round(product.discountRate);
        // 상품명
        $('.detail_title h2').html(product.productName);
        $('.v_top_name').html(product.productName);
        $('.infoArea01 .product_name_css .con span').html(product.productName);

        // 가격 정보
        var productDesc = $('.v_top_txt')
        var discountPrice = $('.price_mobile .p1')
        var retailPrice = $('.price_mobile .p2')
        var discountRate = $('.price_mobile .p3')
        productDesc.html(product.productDesc);
        discountPrice.html(numberFormat(product.discountPrice)+'원');
        
        if(product.discountPrice != product.retailPrice){
            retailPrice.html(numberFormat(product.retailPrice)+'원');
            discountRate.html(numberFormat(Math.round(product.discountRate, 0))+'%');
        } else {
            $('.v_top_txt_box .p2').hide()
            $('.v_top_txt_box .p3').hide();
        }

        // v_n_top_info
        $(".v_n_top_info .point .ex").html(product.deliveryCost)
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

        console.log(app.product)
        getReviewList();
        getProductQuestionList();
        getRecommendedProducts();

    }, function (err) {
        console.log("productDetail error", err);
        alert('상품 정보를 불러오지 못했습니다.');
        location.href = '/';
    }, {
        isRequired: false,
        userId : true
    })
}

function addCart() {
    console.log(selectedOptions);
    if(app.deliveryGroupList.length > 0) {
        // location.href="/order?deliveryGroupList=" + JSON.stringify(app.deliveryGroupList)+'&orderDTO='+ JSON.stringify(app.orderDTO);
    } else {
        alert('상품을 선택해주세요');
        return
    }

    var params = {
        options: app.selectedOptions
    }
    console.log(params);
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
    console.log($(element));
    var selectedIndex = $(element)[0].options.selectedIndex -1;
    var selectedOption = app.product.options[selectedIndex];

    // 깊은 복사
    var option = JSON.parse(JSON.stringify(selectedOption));
    option.optionCount = 1;

    if(!isExistsInArray(option)) {
        option.isSelected = true;
        selectedOptions.push(option);
    }
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
    var optionCount = app.selectedOptions[index].optionCount;
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
    app.selectedOptions[index].optionCount = optionCount;
    drawSelectedOptions();
}

function getSelectedOptionIndex(ele) {
    var optionBox = ele.parent().parent().parent().parent();
    var id = $(optionBox).find(".product_title").attr("id");
    return id.substring('seq_'.length);
}

function drawSelectedOptions() {

    var totalPrice = 0;
    for(var i = 0; i < app.selectedOptions.length; i++) {
        var option = app.selectedOptions[i];
        totalPrice += option.optionDiscountPrice * option.optionCount;
    }
    app.optionTotalPrice = totalPrice;
    
    var requestDeliveryGroupList = new Array();
    var deliveryGroup = new DeliveryGroupDTO();

    var product = JSON.parse(JSON.stringify(app.product));
    product.options = app.selectedOptions;
    
    deliveryGroup.products.push(product);
    deliveryGroup.loadingPlace = product.loadingPlace;
    deliveryGroup.brandCode = product.brandCode;
    deliveryGroup.companyName = product.companyName;
    deliveryGroup.brandName = product.brandName;
    deliveryGroup.setDeliveryCost(isJeju, isExtra);

    if(app.selectedOptions.length < 1) {
        alert('상품을 선택해주세요.')
        return false;
    }

    requestDeliveryGroupList.push(deliveryGroup);

    app.orderDTO = {
        paymentTotalAmount: deliveryGroup.groupPrice,
        totalDeliveryCost: deliveryGroup.totalDeliveryCost
    }
    app.deliveryGroupList = requestDeliveryGroupList;
}

function deleteFromArray(seq) {
    selectedOptions.splice(seq, 1);
    drawSelectedOptions();
}

function checkDeliveryAddress() {
    var params = {};
    
    ajaxCallWithLogin(API_SERVER + '/user/checkDeliveryAddress', params, 'POST',
    function(data) {
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

function getReviewList() {
    var params = {
        productCode: app.product.productCode
    };

    ajaxCall(API_SERVER + '/board/getReview', params, 'POST', 
    function (data) {
    
        app.reviewList = data.result;
        console.log("success", data);
    }, function (err){
        console.log("error while getReview", err);
    })
}

function getProductQuestionList() {
    var params = {
        productCode: app.product.productCode
    };
    
    console.log(params);
    ajaxCall(API_SERVER + '/product/getQAByProduct', params, 'POST', 
    function (data) {
        app.questionList = data.result;
        console.log("success", data);
    }, function (err){
        console.log("error while getReview", err);
    })
}

function formatDate(strDate) {
    if(strDate != undefined && typeof(strDate) == typeof('')) {
        return strDate.substr(0, 10);
    }
    return ''
}

function zzimProduct() {
    
    var url = API_SERVER;

    if(app.product.zzimYn == 'Y') {
        url += '/order/deleteZzim';
    } else if(app.product.zzimYn == 'N') {
        url += '/order/addZzim';
    }

    var params = {
        productNo: app.product.productNo,
        productCode: app.product.productCode
    }

    ajaxCallWithLogin(url, params, 'POST',
   function(data) {
        if(app.product.zzimYn == 'Y') {
            app.product.zzimYn = 'N';
        } else if ( app.product.zzimYn == 'N') {
            app.product.zzimYn = 'Y';
        }
      console.log('zzimaction', params, data);
   }, function(err) {
      console.error(err)
   }, {
      isRequired: true,
      userId: true
   })
}

function getRecommendedProducts() {
    var params = {
        productCode: app.product.productCode
    };

    ajaxCallWithLogin(API_SERVER + '/product/getRecmdProducts', params, 'POST',
    function(data) {
        var result = data.result;

        if(result.length == 0) {
            getProductList();
            return;
        }

        app.recmdList = result;
        insertRecommandListHtml();
    }, function(err) {
        console.error(err);
    }, {
        isRequired: false,
        userId: true
    })
}

function insertRecommandListHtml() {
    
    var recmdList = app.recmdList;
    var html = '';
    for(var i = 0; i < recmdList.length; i++) {
        if(i > 9) {
            break;
        }
        var product = recmdList[i];
        html += '<div><a href=""><img src="'+ RESOURCE_SERVER + product.url +'" alt="상품 이미지'+ (i+1)+'"></a></div>'
    }

    $('.responsive1').html(html);

    $('.responsive1').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay:true,
        autoplaySpeed:3000,
        pauseOnHover:true,
        arrow:true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              dots: false
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 3,
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
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
    });
    
}

function getProductList() {
    var params = {
        category1Code: app.product.category1Code
    }
    ajaxCallWithLogin(API_SERVER + '/product/getProductListByCategory', params, 'POST',
    function(data) {
        console.log(data);
        app.recmdList = data.result;
        
        insertRecommandListHtml();

    }, function(err) {
        console.error(err);
    }, {
        isRequired: false,
        userId: true
    })
}

function changeTab(activeTab) {
    
    $('#content .tab_wrap li').removeClass('active');
    $('#content .tab_cont').removeClass('active');
    $('#content .other_cont').removeClass("active");

    $(this).addClass('active');
    if(activeTab == 'tab1') {
        $('#content .other_cont').addClass("active");
    }
    $('#content #' + activeTab).addClass('active');
    $('div.pdt_detai_tabinner_vn li').on('click',function(){
        $(this).addClass('onTab');
        $(this).siblings().removeClass('onTab');
    });
    
}
// 맨 위로 
$(function(){
    $('#goingTo_top').on('click',function(e){
        e.preventDefault();
        $('html,body').animate({scrollTop:0},600);
    });
});

/* 공유하기 모달 */
function openShareModal() {
    console.log('open share');
    $('#share_modal').show();
    $('html,body').css({'overflow' : 'hidden', 'height' : '100%'});
    $('html,body').on('scroll touchmove mousewheel',function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    });
}
function closeShareModal() {
    $('#share_modal').hide();
    $('html,body').css({'overflow':'visible'});
    $('html,body').off('scroll touchmove mosewheel');
}
// var shareModal = document.getElementById("share_modal")
// shareModal.addEventListener("click",e=> {
//     var evTarget = e.target
//     if(evTarget.classList.contains("share_modal")) {
//         shareModal.style.display = "none"
//         $('html,body').css({'overflow':'visivle'});
//         $('html,body').off('scroll touchmove mosewheel');
//     }
// })

/* 공유하기 */
Kakao.Link.sendDefault({
    objectType: 'feed',
    content: {
      title: '제품 이미지',
      description: '...',
      imageUrl:
        'http://mud-kage.kakao.co.kr/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg',
      link: {
        mobileWebUrl: 'https://developers.kakao.com',
        androidExecutionParams: 'test',
      },
    },
    social: {
      likeCount: 10,
      commentCount: 20,
      sharedCount: 30,
    },
    buttons: [
      {
        title: '웹으로 이동',
        link: {
          mobileWebUrl: 'https://developers.kakao.com',
        },
      },
      {
        title: '앱으로 이동',
        link: {
          mobileWebUrl: 'https://developers.kakao.com',
        },
      },
    ]
  });
