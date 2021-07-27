var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent
    },
    data: {
        totalPointAmount: 0,
        pointList: [],
        usableCouponAmount: 0,
        deleteUser:0
    },
    methods: {
        numberFormat,
        formatDate,
        parsePointType,
        getUsableCouponList
    }
})

$(function() {
    getUsablePointAmount();
    getPointHistory();
    getUsableCouponList();
})

function getUsableCouponList() {
 
    ajaxCallWithLogin(API_SERVER + '/product/getCouponList', {}, 'POST', 
    function(data) {
        app.usableCouponAmount = data.result.length;
        console.log("get usableCouponList", data);
    }, function(err) {
        console.error("get usable coupon list ", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function getUsablePointAmount() {
    var params = {};
    ajaxCallWithLogin(API_SERVER + '/point/getUsablePointByUserId', params, 'POST',
    function(data) {
        if(data.result)
            app.totalPointAmount = numberFormat(data.result);
        
        console.log("success usablePoint", data);
    }, function(err) {
        console.log("error", err)
    },
    {
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

function getPointHistory() {
    ajaxCallWithLogin(API_SERVER + '/point/getPointDetailListByUserId', {},
    'POST',
    function(data) {
        console.log(data);
        app.pointList = data.result;
    
    },function(err) {
        console.error(err);
    }, {
        isRequired: true,
        userId: true
    })
}

function withdrawal() {
    var params = {};
    ajaxCallWithLogin(API_SERVER + '/user/withdrawal', {}, 'POST',
     function(data) {
        alert('회원정보가 삭제되었습니다.');
      
    }, function(err) {
        console.log(err);
    }