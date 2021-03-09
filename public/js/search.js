$(function() {
    $(".result_wrap").hide();
    $('.instant-search__input').keyup(function() {
        var keyword = $(this).val();
        console.log(keyword);
        if(keyword.trim().length > 0 ){
            $(".result_wrap").show();
            searchProduct(keyword);
            
        } else {
            $(".result_wrap").hide();
            
        }
    })
})
function getRecommendKeywords {
    ajaxCall(API_SERVER + '/user/getHotKeyowrd', params, 'POST'
    , function(data) {

    }, function(err) {

    })
}

function searchProduct(keyword) {
    var params = {
        keyword: keyword
    }
    ajaxCall(API_SERVER + '/product/productSearchBar', params, 'POST'
    , function(data) {
        var result = data.result;
        var html = '';
        for(var i = 0; i < result.length; i++) {
            var product = result[i];
            html += '<li><a href="/product/'+ product.productCode +'">'+ product.productName +'</a></li>'; 
        }
        $(".result_wrap .search_result ul").html(html);

    }, function(err) {
        console.log(err);
    })
}