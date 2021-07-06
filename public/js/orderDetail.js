
var app = new Vue({
    el: 'main',
    components: {
        'product-review-modal': productReviewModal,
        'seller-inquiry-modal': sellerInquiryModal,
        'delivery-info-modal': deliveryInfoModal
    },
    data: {
        order: {},
        RESOURCE_SERVER
    },
    methods: {
        convertOrderStatus,
        numberFormat,
        formatDate
    }
})

$(function() {
    getOrderDetail();
})

function getOrderDetail() {

    var params = {
        orderNumber: $('#orderNumber').val()
    }
    console.log(params);
    ajaxCall(API_SERVER + '/order/getPurchaseOrderDetail', params, 'POST',
    function(data) {
        app.order = data.result;
        var products = app.order.products;
        
        app.order.accumulatePoint = 0;
        app.order.totalDeliveryCost = 0;
        for(var i = 0; i < products.length; i++){
            app.order.totalDeliveryCost += products[i].deliveryCost;
            app.order.accumulatePoint += products[i].accumulatePoint;
        }
        console.log(data);

    }, function(err) {
        var responseText = err.responseText;

        if(responseText == 'NOT_FOUND') {
            alert('주문 상세 내역을 불러오지 못했습니다.');
            location.href="/orderlist";
        }
        console.error(err);
    })

}

function formatDate(strDate) {
    if(strDate != undefined && typeof(strDate) == typeof('')) {
        return strDate.substr(0, 10);
    }
    return ''
}

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
    }
    
}