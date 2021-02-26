
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
            $('.main_sub ul').html(html);

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
        $('.main_sub ul').html(html);

    }, function (err){
        console.log("getProductByStandCode err", err);
    }, {
        isRequire: false,
        userId: true
    });
}

function getCategoryList(){
    var category1Code = $('#category1Code').val();
    var params = { category1Code: category1Code };

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

$(function () {
    var listType = $('#listType').val();

    switch(listType){
        case 'EVENT':
            getProductByStandCode();
            break;
        case 'CATEGORY':
            getCategoryList();
            getProductListByCategory();
            break;
    }

    $('#sortOption').change(function() {
        getProductByStandCode();
    })
});
