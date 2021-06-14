var app = new Vue({
    el: 'main',
    data: {
        totalPointAmount: 0,
        pointList: []
    },
    methods: {
        numberFormat,
        formatDate,
        parsePointType
    }
})

$(function() {
    getUsablePointAmount();
    getPointHistory();
})

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

    }
}