var app = new Vue({
    el: '#app',
    components: {
        'mypage-modal': mypageModal
    },
    data: {
        deliveryList: new Array(),
        usablePointAmount: 0,
        usableCouponAmount: 0
    },
    methods: {
        getUsablePointAmount,
        getUsableCouponList,
        getLogin
    }
})



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
        if(data.result) {

            app.usablePointAmount = data.result;
            $('.point-amount span').html(numberFormat(data.result)+'원');   
        }
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
        // var usableCoupon = new Array();
        // for(var i = 0; i < data.result.length; i++) {
        //     var coupon = data.result[i];
        //     if(coupon.couponStatus == 'A') usableCoupon.push(data.result[i])
        // }
        app.usableCouponAmount = data.result.length;

        console.log("get usableCouponList", data);
    }, function(err) {
        console.error("get usable coupon list ", err);
    }, {
        isRequired: true,
        userId: true
    })
}
function openModal() {
    $('#mModal').show();
}

function closeModal() {
    $('#mModal').hide();
}