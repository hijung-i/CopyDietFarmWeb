var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent,
        'delivery-info-modal': deliveryInfoModal
    },
    data: {
        RESOURCE_SERVER,
        orderList: [],
        totalPointAmount: 0,
        deliveryModal: false,
        beforeDeliveryCount: 0,
        currentReview: {},
        onDeliveryCount: 0,
        afterDeliveryCount: 0,
        product: {}
    }, methods: {
        numberFormat,
        formatDate,
        convertOrderStatus
    }
})

$(function() {
    getOrderList();
    getUsablePointAmount();
    getUsableCouponList();
})


function convertOrderStatus(orderStatus) {
    switch(orderStatus) {
        case 'C':
        case 'A':
            return '구매확정';
        case 'XC':
            return '취소완료';
        case 'X':
            return '취소신청';
        case 'S':
            return '배송준비중';
        case 'P':
            return '결제 완료';
        case 'D':
            return '배송중';
        case 'F':
            return '배송완료';
        case 'R':
            return '리뷰작성';
        case 'L':
            return '리뷰작성';
        case 'O':
            return '재주문';
    }
    
}

function getUsableCouponList() {
    ajaxCallWithLogin(API_SERVER + '/product/getCouponList', {}, 'POST',
    function(data) {
        app.usableCouponAmount = data.result.length;
        console.log("get usableCouponList", data);
    }, function(err) {
        console.error("get usable coupon list",err);
    }, {
        isRequired: true,
        userId: true
    })
}

function getOrderList() {
    ajaxCallWithLogin(API_SERVER + '/order/getPurchaseOrderListByUserId', {}, 'POST',
    function(data) {
        var result = data.result;
        console.log(result);
        app.orderList = result;

        beforeDelivery = result.filter(data => 'PS'.includes(data.orderStatus)).length
        onDelivery = result.filter(data => 'D'.includes(data.orderStatus)).length
        afterDelivery = result.filter(data => 'FCA'.includes(data.orderStatus)).length

        console.log(beforeDelivery, onDelivery, afterDelivery)


    }, function(err) {
        console.log(err);
    }, {
        isRequired: true,
        userId: true
    })
}

function formatDate(dateStr) {
    var date = new Date(dateStr);
    var month = '' + (date.getMonth() + 1);
    month = (month.length < 2)?'0'+month: month;
    
    var day = '' + (date.getDate());
    day = (day.length < 2)?'0'+day: day;
    return month + '-' + day;
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