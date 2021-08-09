
var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent,
        'seller-inquiry-modal': sellerInquiryModal,
        'product-review-modal': productReviewModal,
        'delivery-info-modal': deliveryInfoModal,
        'delivery-select-modal': deliverySelectModal,
    },
    data: {
        order: {
            products: {}
        },
        products: {},
        totalPointAmount: 0,
        RESOURCE_SERVER,
        deliveryInfoModalShow: false,
        deliveryIndex: -1,
        deliveryProgress: {},
        trackingDetails: [],

        reviewModal: false,
        inquiryModal: false,
        deliveryModal: false,
        orderCancelModalShow: false,
        beforeDeliveryCount: 0,
        onDeliveryCount: 0,
        afterDeliveryCount: 0,
        deliverySelectModalShow: false,
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
        },
        openDeliveryInfo: function(pIdx) {
            this.product = this.order.products[pIdx];

            this.product.courierNo = this.product.courierNo.replace(COURIER_NO_REGEX, '')
            this.product.deliveryName = this.order.deliveryName;

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
        },
        closeModal: function() {
            app.deliveryInfoModalShow = false;
            scrollAllow();
        },
        getDeliveryProgress: async function() {
            // TODO: 배송지 정보가 있는지 Check 없으면 API 호출 후 DB에 저장
            var params = {
                purchaseProductNo: this.product.purchaseProductNo
            }
            
            var component = this;
            ajaxCall(API_SERVER + '/order/selectDeliveryState', params, 'POST',
            function(data) {
                console.log(data);
                component.deliveryProgress = data.result
                component.createTrackingDetail();
            }, function(err) {
                console.log('error 발생', err);
                if(err.responseText == 'ERROR_SERVER') {
                    console.log(component)
                    parcelTrackSmart(component.product.courierCode, component.product.courierNo)
                    .then(data => {
                        component.deliveryProgress = data;
                        var requestProduct = Object.assign({}, component.product)
                        requestProduct.deliveryStateDetail = JSON.stringify(component.deliveryProgress);
                        component.createTrackingDetail();

                        ajaxCall(API_SERVER + '/order/updateDeliveryState', requestProduct, 'POST',
                        function(data) {
                            console.log('delivery info update', data);
                        }, function(err) {
                            console.log('delivery info update failed', err);
                        })

                    }). catch(err => {
                        console.log(err);
                        alert('배송 정보를 불러오지 못했습니다. 잠시 후에 다시 시도해주세요');
                        return;
                    })
     
                }
            })

        }, 
        createTrackingDetail: function() {
            this.getDeliveryProgress();
            this.trackingDetails = new Array();
            Array.from(this.deliveryProgress.trackingDetails).forEach((detail, index, array) => {
                if(index > 0) {
                    if (array[index-1].timeString.substring(0, 10) != detail.timeString.substring(0, 10)) {
                        this.trackingDetails.push({ kind: 'DATE', text: detail.timeString.substring(0, 10) })
                    }
                } else {
                    this.trackingDetails.push({ kind: 'DATE',  text: detail.timeString.substring(0, 10) })
                }
                
                var text = detail.timeString.substring(11, 16) + ' [' + detail.where + '] ' + detail.kind +'했습니다.';
                this.trackingDetails.push({ kind: 'DETAIL' , text})
            })
            console.log(this.trackingDetails)
        }

    }, mounted: async function() {
        var data = await carriersTrackSmart();

        if(data['Company'] != undefined) {
            this.carrierList = data['Company'];
        } else {
            alert('택배사 정보 조회에 실패했습니다.')
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