
var selectedOptions = new Array();
var isExtra = false, isJeju = false;

var app = new Vue({
    el: 'main',
    components: {
        'product-review-modal': productReviewModal,
        'image-modal': ImageModalComponent,
        'product-inquiry-modal': productInquiryModal,
        'mypage-modal': signModal
    },
    data: {
        RESOURCE_SERVER,
        selectedOptions,
        product: {},
        pointReason: '실 결제금액의 3%',
        optionTotalPrice: 0,
        orderDTO: {},
        deliveryGroupList: [],
        
        review: undefined,
        writable: undefined,

        reviewList: [],
        writableList: [],
        reviewModal: false,
        
        imageModalShow: false,
        initialIndex: 0,

        currentQuestion: {},
        questionList: [],
        inquiryModal: false,
        recmdList: [],
        modal: []
    }, methods: {
        numberFormat,
        deleteFromArray,
        changeOptionCount,
        formatDate,
        masking,
        onSubmit: function() {
            if(app.selectedOptions != undefined && app.selectedOptions.length > 0) {
                location.href="/order?deliveryGroupList=" + JSON.stringify(app.deliveryGroupList).replace(/&/gi, ';amp;')+'&orderDTO='+ JSON.stringify(app.orderDTO).replace(/&/gi, ';amp;');
            } else {
                alert('상품을 선택해주세요');
            }
        },
        onOptionSelected,
        zzimProduct,
        onReviewImageClick: function(rIdx, fIdx) {
            // rIdx: index of review
            // fIdx: index of file
            this.review = this.reviewList[rIdx];
            this.initialIndex = fIdx;

            this.imageModalShow = true;

        },
        onReviewUpdateClick: function(index) {
            this.review = this.reviewList[index];

            openReviewModal()
        },
        onInquiryUpdateClick: function(index) {
            this.currentQuestion = this.questionList[index];
            var isChecked = this.currentQuestion.checkbox;

            this.currentQuestion.checkbox 
                = (isChecked != undefined && (isChecked == true || isChecked == 'Y'))?true:false;
            openInquiryModal()
        },
        onChildPopupClosed: function(data) {
            this.reviewModal = false;
            this.inquiryModal = false; 

            this.review = {};
            this.currentQuestion = {};
        },
        insertReviewComplete: function(data) {
            this.reviewList.push(data);
        },
        deleteReview: function(index) {
            var params = {
                
            };
            ajaxCallWithLogin(API_SERVER + '/board/deleteReview', params, 'POST'
            , function(data) {

            }, function(err) {
                
            })
            this.reviewList.splice(index, 1);
        },
        insertInquiryComplete: function(data) {
            this.questionList.push(data);
        },
        deleteInquiry: function(index) {
            var params = this.questionList[index];

            ajaxCallWithLogin(API_SERVER + '/product/removeQA', params, 'POST'
            , function(data) {
                alert('문의 삭제에 성공했습니다.');
                app.questionList.splice(index, 1);
            }, function(err) {
                console.log(err);
            }, {
                isReuqired: true,
                userId: true
            });
        }
    }, computed: {
        brandListUrl: function() {
            const brandCode = this.product.brandCode
            const companyCode = this.product.companyCode
            
            let brandName = this.product.brandName
            brandName = (brandName === '')? this.product.companyName : brandName
            
            let url = '/products/' + companyCode + '/brand?brandName=' + brandName
            if (brandCode != '') {
                url += '&brandCode=' + brandCode
            }

            return url
        }, selectedOptionWidth: function() {
            var WIDTH_PER_ITEM = 306 + 10

            return (WIDTH_PER_ITEM * this.selectedOptions.length ) - 10 + 'px'
        },
        accumulatePoint: function() {
            var accumulatePoint = this.optionTotalPrice * 0.03
            if(this.product.productCode == "P00879" || this.product.productCode == "P00982") {
                var totalCount = 0
                Array.from(this.selectedOptions).forEach(function(option) {
                    totalCount += option.optionCount;
                })

                this.pointReason = '적립 이벤트'
                accumulatePoint = (totalCount * 10000)
            }
            return Math.round(accumulatePoint);
        },
        deliveryCost: function() {
            
            var deliveryCost = this.product.deliveryCost;
            // var boxCount = 1;
            // // if(this.product.countPerDelivery != 0) {
            // //     boxCount = 
            // // }
            // // deliveryCostBasis 검사
            
            var deliveryCostStr = '';

            if(this.product.deliveryCostBasis == 0 || this.product.deliveryCostBasis == null) {
                deliveryCostStr = '무료배송'
            } else if(this.product.deliveryCostBasis >= 999999) {
                deliveryCostStr = numberFormat(deliveryCost) + '원<br>무료배송 없음'
            } else {
                deliveryCostStr = numberFormat(deliveryCost) + '원<br>' + numberFormat(this.product.deliveryCostBasis) + '원 이상 구매시 무료배송'
            }

            return deliveryCostStr;
        }
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
        if(data.result.isLoggedIn == true) {
            getWritableReviewList();
            checkDeliveryAddress();
        }
    }, function(err) {
        console.log("error", err);
    })

   
})
function getProductListByCategory() {
    var category1Code = $('#category1Code').val();
    var category2Code = $('#category2Code').val();
    var sortOption = $('#sortOption').val();

    if((category1Code == null || category1Code == undefined || category1Code == '')
        || (category2Code == null || category2Code == undefined || category2Code == '')){
        // TODO: Open alert modal
        // location.href = '/'
    }
    if(category2Code == 'ALL') category2Code = '';

    var params = {
        category1Code: category1Code,
        category2Code: category2Code,
        sortOption: sortOption
    }
    
ajaxCallWithLogin(API_SERVER + '/product/getProductListByCategory', params, 'post'
, function (data) {  
    if(data.result.length > 0) {
        console.log(data.result);
        var category1Name = data.result[0].category1Name
        var html = generateHtmlForProductList(data.result);

        $('.sub_items ul').html(html);
        $('.keyword').html(category1Name);
    } else {
        $('.sub_items ul').hide();
        $('.pick_list_null').show();
        $('.pick_list_null').html('<img src="/images/gift_icon_detailpage@2x.png"><p>더 나은 구성을 위해 상품 준비중입니다.</p>');
    }

}, function (err){
    console.log("getProductListByCategory err", err);
}, {
    isRequire: false,
    userId: true
});

}

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
        app.product = data.result;

        var html = '';
        for(var i = 0; i < app.product.representative.length; i++ ) {
            var image = app.product.representative[i];
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

        if(app.product.options.length == 1) {
            app.selectedOptions = JSON.parse(JSON.stringify(app.product.options));
            app.selectedOptions[0].optionCount = 1;
            app.selectedOptions[0].isSelected = true;
            drawSelectedOptions();
        }

        app.product.discountRate = Math.round(app.product.discountRate);
        // 상품명
        $('.detail_title h2').html(app.product.productName);
        $('.v_top_name').html(app.product.productName);
        $('.infoArea01 .product_name_css .con span').html(app.product.productName);

        // 가격 정보
        var productDesc = $('.v_top_txt')
        var discountPrice = $('.price_mobile .p1')
        var retailPrice = $('.price_mobile .p2')
        var discountRate = $('.price_mobile .p3')
        productDesc.html(app.product.productDesc);
        discountPrice.html(numberFormat(app.product.discountPrice)+'원');
        
        if(app.product.discountPrice != app.product.retailPrice){
            retailPrice.html(numberFormat(app.product.retailPrice)+'원');
            discountRate.html(numberFormat(Math.round(app.product.discountRate, 0))+'%');
        } else {
            $('.v_top_txt_box .p2').hide()
            $('.v_top_txt_box .p3').hide();
        }

        // v_n_top_info
        $(".v_n_top_info .point .ex").html(app.product.deliveryCost)
        $(".v_n_top_info .courier-name .ex").html(app.product.deliveryCompany);
        
        var deliveryCostHtml = '';
        if(app.product.deliveryCostBasis == 0){
            deliveryCostHtml = '무료배송';
        } else if(app.product.deliveryCostBasis < 999999) {
            deliveryCostHtml = numberFormat(app.product.deliveryCostBasis)+'원 이상 구매시 무료배송';
        } else {
            deliveryCostHtml = numberFormat(app.product.deliveryCost); 
            if(app.product.deliveryCost3 != 0) {
                deliveryCostHtml += ' ~ ' + numberFormat(app.product.deliveryCost3) + '원';
            }
        }
        $('.v_n_top_info .delivery-cost .ex').html(deliveryCostHtml);

        var packingTypeHtml = '';
        if (app.product.packingType == 'A') packingTypeHtml = '상온 (종이박스)';
        else if (app.product.packingType == 'B') packingTypeHtml = '냉장 (아이스박스)';
        $('.v_n_top_info .packing-type .ex').html(packingTypeHtml);

        app.product.formattedDiscountPrice = numberFormat(app.product.discountPrice);
        console.log(app.product)
        getReviewList();
        getProductQuestionList();
        getRecommendedProducts();

    }, function (err) {
        console.log("productDetail error", err);
        alert('상품 정보를 불러오지 못했습니다.', JSON.stringify(err));
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
        // Array.from(app.reviewList).forEach(function(item) {
            
        // })
        console.log("success", data);
    }, function (err){
        console.log("error while getReview", err);
    })
}

function getProductQuestionList() {
    var params = {
        productCode: app.product.productCode
    };
    
    ajaxCallWithLogin(API_SERVER + '/product/getQAByProduct', params, 'POST', 
    function (data) {
        app.questionList = data.result;
        console.log("success", data);
    }, function (err){
        console.log("error while getReview", err);
    }, {
        isRequired: false,
        userId: true
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
    var slider = new ProductSlider(recmdList, {
        count: 3,
        margin: 15
    });

    slider.setElement('.responsive')

}

function getProductList() {
    var params = {
        category1Code: app.product.category1Code
    }
    ajaxCallWithLogin(API_SERVER + '/product/getProductListByCategory', params, 'POST',
    function(data) {
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

/* 공유하기 모달 스크롤 제어 */
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
/* 카카오톡 공유하기 */
Kakao.Link.createScrapButton({
    container: '#kakao-link-btn',
    requestUrl: 'https://developers.kakao.com',
    templateId: 55707
  });

function getWritableReviewList() {
    var productCode = $("#productCode").val();

    var params = {
        productCode: productCode
    }

    ajaxCallWithLogin(API_SERVER + '/board/getWritableReview', params, 'POST',
    function(data) {
        app.writableList = data.result;
        console.log("writableList", data.result);
    }, function(err) {
        console.log(err);
    }, {
        isRequired: true,
        userId: true
    })
}

function sendKakaoLink() {

    Kakao.Link.sendDefault({
        // requestUrl: url,
        objectType: 'feed',
        content: {
            title: app.product.productName,
            imageUrl:
                RESOURCE_SERVER + app.product.url,
            link: {
                mobileWebUrl: 'https://dietfarm.page.link/?link=https://dietfarm.co.kr/product/'+ app.product.productCode+'&apn=com.dietFarm',
                webUrl: 'https://dietfarm.page.link/?link=https://dietfarm.co.kr/product/'+ app.product.productCode
            },
        },
        buttons: [
            {
                title: '상품 보러가기',
                link: {
                    mobileWebUrl: 'https://dietfarm.page.link/?link=https://dietfarm.co.kr/product/'+ app.product.productCode+'&apn=com.dietFarm',
                    webUrl: 'https://dietfarm.page.link/?link=https://dietfarm.co.kr/product/'+ app.product.productCode
                },
            }
        ],
        callback: function() {
            console.log("공유 click");
        }
    });
    
}

