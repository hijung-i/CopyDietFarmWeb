$(function() {
    $(".result_wrap").hide();
    $('.instant-search__input').keyup(function() {
        var keyword = $(this).val();
        if(keyword.trim().length > 0 ){
            $(".result_wrap").show();
            searchProduct(keyword);
            
        } else {
            $(".result_wrap").hide();
            
        }
    })

    $(".search_box_ico").click(function() {
        goSearchResult();
    })
    
    getHotKeyowrds();
    getCFKeywords();
})

function getHotKeyowrds() {
    var params = {};
    ajaxCall(API_SERVER + '/user/getHotKeyword', params, 'POST'
    , function(data) {
        var result = data.result;
        var five = '';
        var ten = '';

        var n = (result.length > 10)?10:result.length;
        for(var i = 0; i < n; i++){
            var keyword = result[i];
            if( i < 5 ){
                five += '<li><a href="/search-list?keyword='+keyword.keyword+'"><span>'+ (i + 1) +'</span>&nbsp;&nbsp;'+ keyword.keyword +'</a></li>';
            } else if ( i >= 5){
                ten += '<li><a href="/search-list?keyword='+keyword.keyword+'"><span>'+ (i + 1) +'</span>&nbsp;&nbsp;'+ keyword.keyword +'</a></li>';
            }
            
        }
        $('.search_list ul.five').html(five);
        $('.search_list ul.ten').html(ten);
    }, function(err) {
        console.log("error while get getHotKeyword ",err);
    })
}
function getCFKeywords() {
    var params = {};
    ajaxCall(API_SERVER + '/user/getCFKeyword', params, 'POST'
    , function(data) {
        var result = data.result;
        var html = '';
        for(var i = 0; i < result.length; i++){
            var keyword = result[i];
            html += '<li><a href="/search-list?keyword='+ keyword.keyword + '">'+ keyword.keyword +'</a></li>';
        }
        $('.recommend ul').html(html);

    }, function(err) {
        console.log("error while get getCFKeyword ",err);
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

function goSearchResult() {
    var keyword = $('#mobileSearchKeyword').val().trim();
    if(keyword.length == '' || keyword.length < 1) {
        alert('검색어를 입력해주세요');
        return;
    }
    
    $("#mobileSearchForm input[name=keyword]").val(keyword);
    $("#mobileSearchForm").submit();
}