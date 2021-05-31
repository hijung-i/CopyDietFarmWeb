$(function() {
    getLogin();
})


function getLogin() {
    ajaxCall('/user/login', '', 'GET', function(data){
        var isLoggedIn = data.result.isLoggedIn;

        if(isLoggedIn) {
            getUsablePointAmount();
            getUsableCouponList();
        }
        console.log("data", data);
    }, function(err){
        console.log("err", err);
    })
}

function getUsablePointAmount() {
    var params = {};
    ajaxCallWithLogin(API_SERVER + '/point/getUsablePointByUserId', params, 'POST',
    function(data) {
        if(data.result)
            $('.point-amount span').html(numberFormat(data.result)+'원');

        console.log("success usablePoint", data);
    }, function(err) {
        console.log("error", err)
    },
    {
        isRequired: true,
        userId: true
    })
}

function getUsableCouponList() {
    ajaxCallWithLogin(API_SERVER + '/product/getCouponList', {}, 'POST', 
    function(data) {
        var couponLength = data.result.length;
        $('.coupon-amount span').html(numberFormat(couponLength) + '장')
        console.log("get usableCouponList", data);
    }, function(err) {
        console.error("get usable coupon list ", err);
    }, {
        isRequired: true,
        userId: true
    })
}
