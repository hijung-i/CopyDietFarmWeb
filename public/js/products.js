new Vue({
    el: 'main',
    components: {
        'mypage-modal': signModal
    }
})
$(function () {
    getDatas();

    $('#sortOption').change(function() {
        getDatas();
    })
});

function getProductByStandCode() {
    var salesStandCode = $('#currentStandCode').val();
    var sortOption = $('#sortOption').val();
    var salesStandName =  $('#salesStandName').val();

    if(salesStandCode){
        var params = {
            salesStandCode: salesStandCode,
            sortOption: sortOption,
            salesStandName: salesStandName
        }
        
        ajaxCallWithLogin(API_SERVER + '/product/getProductByStandCode', params, 'post'
        , function (data) {  
            var html = generateHtmlForProductList(data.result);
            $('.sub_items ul').html(html);

        }, function (err){
            console.log("getProductByStandCode err", err);
        }, {
            isRequire: false,
            userId: true
        });
    } else {
        // TODO: Open alert modal
    }
}

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

function getCategoryList(){
    var category1Code = $('#category1Code').val();
    var sortOption = $('#sortOption').val();

    var params = {
        category1Code: category1Code,
        sortOption
    };

    ajaxCallWithLogin(API_SERVER + '/product/getCategoryList', params, 'post'
    , function (data) {

        for(var i = 0; i < data.result.length; i++){
            var cate = data.result[i];

            $('.myPage_title').html(cate.category1Name);
            if(cate.category1Code == category1Code){
                var html = '';
                html += '<a class="web_cate"><img src="/images/category_ico_main.png">전체카테고리</a>';
                html += '<a href="/products/'+ category1Code +'/category/ALL">전체보기</a>';
                for(var j = 0; j < cate.category2.length; j++){
                    var  menuCate2 = cate.category2[j]
                    html += '<a href="/products/'+ category1Code +'/category/'+ menuCate2.category2Code +'">' + menuCate2.category2Name + '</a>';
                }
                $('.nav_wrap #nav').html(html);
                $('.nav_wrap #nav a').css({
                    'width': 'fit-content'
                });

                break;
            }
        }
        
        $('.web_cate').click(function() {
            var isActive = $('.web_cate').hasClass("active");
            if( isActive ){
                sideTabClose();
            } else {
                sideTabOpen();
            }
        });
    }, function (err){
        console.log("getProductByStandCode err", err);
    }, {
        isRequire: false,
        userId: true
    });
}

function productSearch(keyword) {
    
    var sortOption = $('#sortOption').val();
    var params = {
        keyword,
        sortOption
    }

    var keywordDesc = "<span style=\"color: red;\">\""+keyword + "\"</span>에 대한 검색 결과";
    $('.keyword').html(keywordDesc);

    ajaxCallWithLogin(API_SERVER + '/product/productSearchBar', params, 'POST',
    function(data) {

        var html = generateHtmlForProductList(data.result);
        $('.sub_items ul').html(html);
        
        console.log("search success", data);
    }, function(err) {
        console.log("searchKeyword", err);
    }, {
        isRequired: false,
        userId: true
    })
}

function getPickProduct() {
    ajaxCallWithLogin(API_SERVER + '/order/getZzimInfoByUserID', {}, 'POST',
    function(data) {
        for(var i = 0; i < data.result.length; i++) {
            data.result[i].zzimYn = 'Y'; 
        }
        if(data.result.length > 0) {
            var html = generateHtmlForProductList(data.result);
            
            $('.sub_items ul').html(html);
        } else {
            $('.sub_items ul').hide();
            $('.pick_list_null').show();
            $('.pick_list_null').html('<img src="/images/twoheart_icon_heart@2x.png"><p>찜한 상품이 없습니다.</p>');
        }
        console.log("loading zzim list", data);
    }, function(err) {
        console.log("error while load zzim", err);
    }, {
        isRequire: true,
        userId: true
    })
}

function getProductListByBrandCode() {
    var brandCode = $('#brandCode').val();
    var companyCode = $('#companyCode').val();
    var brandName = $('#brandName').val();

    var params = {
        brandCode,
        companyCode,
        brandName
    };

    ajaxCallWithLogin(API_SERVER + '/product/getBrandListDetail', params, 'POST',
    function(data){
        console.log("get ProductList by BrandCode", data);
        var brandName = data.result[0].brandName
        var html = generateHtmlForProductList(data.result);
        $('.sub_items ul').html(html)
        $('.myPage_title').html(app.brand.brandName);
        
    }, function(err) {
        console.error("err");
    }, {
        isRequired: false,
        userId: true
    })
}

function getDatas() {
    var listType = $('#listType').val();

    switch(listType){
        case 'EVENT':
            getProductByStandCode();
            break;
        case 'CATEGORY':
            getCategoryList();
            getProductListByCategory();
            break;
        case 'SEARCH':
            if($('#keyword').length > 0){
                var keyword = $("#keyword").val();
                $('#search-form [name=keyword]').val(keyword);
                productSearch(keyword);
            }
            break;
        case 'ZZIM':
            getPickProduct();
            break;
        case 'BRAND':
            getProductListByBrandCode();
            break;

    }
}
// 맨 위로 
$(function(){
    $('#goingTo_top').on('click',function(e){
        e.preventDefault();
        $('html,body').animate({scrollTop:0},600);
    });
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