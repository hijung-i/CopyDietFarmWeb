var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent,

        'order-cancel-modal': OrderCancelModal,
        'delivery-info-modal': deliveryInfoModal,
        'product-review-modal': productReviewModal
    },
    data: {
        RESOURCE_SERVER,
        userInfo: {},
        orderList: [],
        totalPointAmount: 0,

        reviewModal: false,
        deliveryModal: false,
        orderCancelModalShow: false,
        beforeDeliveryCount: 0,
        onDeliveryCount: 0,
        afterDeliveryCount: 0,

        currentProduct: {},
        currentReview: {},

        writable: { purchaseProductNo: 0 },
        writableList: [],
        reviewList: [],
        reviewModal: false,
        product: {},
        level: 0
    }, methods: {
        numberFormat,
        formatDate,
        convertOrderStatus,
        orderConfirm,
        onOrderCancelClick: function(oIdx, pIdx) {
            this.currentProduct = this.orderList[oIdx].products[pIdx];

            openCancelModal();
        },
        
        onReviewUpdateClick: function(index) {
            this.currentReview = this.reviewList[index];

            openReviewModal()
        },
        onInquiryUpdateClick: function(index) {
            this.currentQuestion = this.questionList[index];
            var isChecked = this.currentQuestion.checkbox;

            this.currentQuestion.checkbox 
                = (isChecked != undefined && (isChecked == true || isChecked == 'Y'))?true:false;
            openInquiryModal()
        },
        onChildPopupClosed: function(data) {
            this.reviewModal = false;
            this.inquiryModal = false; 
            this.deliveryModal = false;
            
            this.currentReview = {};
            this.currentQuestion = {};
        },
    }, mounted: function() {
        var userId = $('#userId').val();
        var userName = $('#userName').val();
        var userCellNo = $('#userCellNo').val();

        this.userInfo = {
            userId,
            userName,
            userCellNo
        }

        if(this.userInfo.userId == undefined || this.userInfo.userId == '비회원주문') {
            this.level = 1
            return;
        }
        this.level = 2;
        console.log('level 2')

        getOrderList(this.userInfo);
        getUsablePointAmount();
        getUsableCouponList();
    }
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

function getOrderList(userInfo) {
    var params = {};
    if(userInfo.userId == '비회원주문') {
        params = userInfo
    }

    ajaxCallWithLogin(API_SERVER + '/order/getPurchaseOrderListByUserId', params, 'POST',
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
        alert('주문 취소 신청이 완료되었습니다.')
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