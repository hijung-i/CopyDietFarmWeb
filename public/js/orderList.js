var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent,
        'delivery-info-modal': deliveryInfoModal,
        'product-review-modal': productReviewModal
    },
    data: {
        RESOURCE_SERVER,
        orderList: [],
        totalPointAmount: 0,
        reviewModal: false,
        deliveryModal: false,
        beforeDeliveryCount: 0,
        onDeliveryCount: 0,
        afterDeliveryCount: 0,
        usableCouponAmount: 0,
        product: {}
    }, methods: {
        numberFormat,
        formatDate,
        convertOrderStatus,
        orderConfirm,
        openCancelModal,
        getUsableCouponList,
        onChildPopupClosed: function(data) {
            this.reviewModal = false,
            this.inquiryModal = false,
            this.deliveryModal = false
        }
    }
})

$(function() {
    getOrderList();
    getUsablePointAmount();
    getUsableCouponList();
})
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

function openCancelModal() {
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

function orderConfirm(oIdx, pIdx) {
    var order = app.orderList[oIdx];
    var product = order.products[pIdx];
    var params = {
        orderNumber: order.orderNumber,
        products: []
    }
    params.products.push(product);
    ajaxCallWithLogin(API_SERVER + '/order/orderConfirm', params, 'POST',
    function(data) {
        alert('구매확정에 성공했습니다.');
        getOrderList();

        console.log(data);
    }, function(err) {
        console.error(err);
    }, {
        isRequired: true,
        userId: true
    })
}

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