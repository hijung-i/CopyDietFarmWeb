var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent
    },
    data: {
        totalPointAmount: 0,
        pointList: [],
        usableCouponAmount: 0
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

function parsePointType(pointType) {
    switch(pointType) {
        case "W":
            return "직원 복지 포인트";
        case "R":
            return "리뷰 적립";
        case "P":
            return "포토 리뷰 적립";
        case "D":
            return "적립금 사용";
        case "O":
            return "주문 적립";
        case "F":
            return "채널 추가";
        case "X":
            return "주문 취소";
        case "C":
            return "회원 추천";
        case "M":
            return "회원가입";
        case "E":
            return "기간만료";
        case "J":
            return "물 마시기";
        case "S":
            return "만보기";

    }
}