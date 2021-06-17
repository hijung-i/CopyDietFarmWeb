var app = new Vue({
    el: 'main',
    data: {
        RESOURCE_SERVER,
        orderList: []
    }, methods: {
        numberFormat,
        formatDate,
        convertOrderStatus
    }
})

$(function() {
    getOrderList();
})

function getOrderList() {
    ajaxCallWithLogin(API_SERVER + '/order/getPurchaseOrderListByUserId', {}, 'POST',
    function(data) {
        var result = data.result;
        console.log(result);
        app.orderList = result;

    }, function(err) {
        console.log(err);
    }, {
        isRequired: true,
        userId: true
    })
}

function requestOrderCancel(order) {
    var params = {
        orderNumber: order.orderNumber,
        purchaseProductNo: order.purchaseProductNo,
        content: order.content
    }
    
    ajaxCallWithLogin(API_SERVER + '/order/orderCancel', params, 'POST',
    function(data){
        console.log("success", data);
    }, function(err) {
        console.log("error", err);
    }, {
        isRequire: true,
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

function OpenCancelModal() {
    console.log('open cancel');
    $('#x_modal').show();
    $('html,body').css({'overflow':'hidden', 'height':'100%'});
    $('html,body').on('scroll touchmove mousewheel', function(event) {
        event.preventDfault();
        event.stopPropagation();
        return false;
    });
}
function closeCancelModal() {
    console.log('close cancel');
    $('#x_modal').hide();
    $('html,body').css({'overflow':'visible'});
    $('html,body').off('scroll touchmove mousewheel');
}
var cancelModal = document.getElementById("x_modal")
cancelModal.addEventListener("click",e => {
    var evTarget = e.target
    if(evTarget.classList.contains("modal-overlay")) {
        cancelModal.style.display = "none"
        $('html,body').css({'overflow':'visible'});
        $('html,body').off('scroll touchmove mousewheel');
    }
})

function convertOrderStatus(orderStatus) {
    switch(orderStatus) {
        case 'C':
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
        case 'R':
            return '리뷰작성';
        case 'L':
            return '리뷰작성';
        case 'O':
            return '재주문';
    }
    
}
