
$(function () {
    getDatas();

    $('#sortOption').change(function() {
        getDatas();
    })
});

function getProductByStandCode() {
    var salesStandCode = $('#currentStandCode').val();
    var sortOption = $('#sortOption').val();

    if(salesStandCode){
        var params = {
            salesStandCode: salesStandCode,
            sortOption: sortOption 
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
        var html = generateHtmlForProductList(data.result);
        $('.sub_items ul').html(html);

    }, function (err){
        console.log("getProductByStandCode err", err);
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
            if(cate.category1Code == category1Code){
                var html = '<li class=""><a href="/products/'+ category1Code +'/category/ALL">전체보기</a></li>';
                for(var j = 0; j < cate.category2.length; j++){
                    var  menuCate2 = cate.category2[j]
                    html += '<li class=""><a href="/products/'+ category1Code +'/category/'+ menuCate2.category2Code +'">' + menuCate2.category2Name + '</a></li>';
                }
                $('#header .main_gnb').html(html);
                $('#header .main_gnb li').css({
                    'width': 'fit-content'
                });

                break;
            }
        }
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
    $('.main_sub h2').html(keywordDesc);

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
        
        var html = generateHtmlForProductList(data.result);
        $('.sub_items ul').html(html);
        console.log("loading zzim list", data);
    }, function(err) {
        console.log("error while load zzim", err);
    }, {
        isRequire: true,
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
    }
}
// 맨 위로 
$(function(){
    $('#goingTo_top').on('click',function(e){
        e.preventDefault();
        $('html,body').animate({scrollTop:0},600);
    });
});