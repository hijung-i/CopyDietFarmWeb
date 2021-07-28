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
        deliveryInfoModalShow: false,

        beforeDeliveryCount: 0,
        onDeliveryCount: 0,
        afterDeliveryCount: 0,
        
        product: {},
        carrierList: []
    }, methods: {
        numberFormat,
        formatDate,
        convertOrderStatus,
        openDeliveryInfo: function(oIdx, pIdx) {
            var currentOrder = this.orderList[oIdx];
            this.product = currentOrder.products[pIdx]
    
            this.product.courierNo = this.product.courierNo.replace(COURIER_NO_REGEX, '')
            this.product.deliveryName = currentOrder.deliveryName;

            var found = Array.from(this.carrierList).find(e => 
                e['Name'] == this.product.courierName
            )
            console.log('found', found)

            if(found == undefined || found['Code'] == undefined) {
                alert('택배사 정보가 잘못되었거나 지원하지 않는 택배사입니다.')
                return;
            }

            this.product.courierCode = found['Code']
            this.deliveryInfoModalShow = true;
        }
    }, computed:{
        deliveryListURL: function(){
            return Object.assign(params, this.product);
        }
    },
    created: async function() {
        var data = await carriersTrackSmart();

        if(data['Company'] != undefined) {
            this.carrierList = data['Company'];
        } else {
            alert('택배사 정보 조회에 실패했습니다.')
        }
    }
})

$(function() {
    getOrderList();
    getUsablePointAmount();
    getUsableCouponList();

    convertOrderStatus();  
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
        app.orderList = result;

        beforeDelivery = result.filter(data => 'PS'.includes(data.orderStatus))
        onDelivery = result.filter(data => 'D'.includes(data.orderStatus))
        afterDelivery = result.filter(data => 'FCA'.includes(data.orderStatus))

        console.log(beforeDelivery, onDelivery, afterDelivery)
    }, function(err) {
        console.log(err);
    }, {
        isRequired: true,
        userId: true
    })

    // var orderList = new Array();
    // orderList.push({
    // })

    // app.orderList = orderList
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