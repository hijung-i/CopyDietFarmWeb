
var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent,
        'product-review-modal': productReviewModal,
        'seller-inquiry-modal': sellerInquiryModal,
    },
    data: {
        order: {
            products: {}
        },
        totalPointAmount: 0,
        RESOURCE_SERVER,
        reviewModal: false,
        inquiryModal: false,
        inquiryList: [],
        inquiry: { purchaseProductNo: 0 }
    },
    methods: {
        convertOrderStatus,
        numberFormat,
        formatDate,
        onChildPopupClosed: function(data) {
            this.reviewModal = false
            this.inquiryModal = false
        }

    }
})

$(function() {
    getOrderDetail();
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

function getUsablePointAmount() {
    var params = {};
    ajaxCallWithLogin(API_SERVER + '/point/getUsablePointByUserId', params, 'POST',
    function(data) {
        if(data.result)
            app.totalPointAmount = numberFormat(data.result);

            console.log("success usablePoint",data);
    }, function(err) {
        console.log("error",err)
    },
    {
        isRequired: true,
        userId: true
    })
}