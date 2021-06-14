var app = new Vue({
    el: 'main',
    data: {
        couponList: []
    }, methods: {
        numberFormat,
        formatDate,
        applyCoupon: function() {
            return false;
        }

    }
})

$(function() {
    getUsableCouponList();
})

function getUsableCouponList() {
    
    ajaxCallWithLogin(API_SERVER + '/product/getCouponList', {}, 'POST', 
    function(data) {
        var usableCoupon = new Array();
        for(var i = 0; i < data.result.length; i++) {
            var coupon = data.result[i];
            if(coupon.couponStatus == 'A') usableCoupon.push(data.result[i])
        }

        app.couponList = usableCoupon;

        console.log("get usableCouponList", data);
    }, function(err) {
        console.error("get usable coupon list ", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function formatDate(strDate) {
    if(strDate != undefined && typeof(strDate) == typeof('')) {
        return strDate.substr(0, 10);
    }
    return ''
}