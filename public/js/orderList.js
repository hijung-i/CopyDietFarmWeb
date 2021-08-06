var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent,
        'alert-modal': AlertModalComponent,
        'order-cancel-modal': OrderCancelModal,
        'delivery-info-modal': deliveryInfoModal,
        'product-review-modal': productReviewModal
    },
    data: {
        RESOURCE_SERVER,
        userInfo: {},
        orderList: [],
        totalPointAmount: 0,
        deliveryInfoModalShow: false,
        deliveryIndex: -1,
        deliveryProgress: {},
        trackingDetails: [],

        reviewModal: false,
        deliveryModal: false,
        orderCancelModalShow: false,
        beforeDeliveryCount: 0,
        onDeliveryCount: 0,
        afterDeliveryCount: 0,

        currentProduct: {},
        writable: { purchaseProductNo: 0 },
        writableList: [],
        reviewList: [],
        reviewModal: false,

        alertModalShow: false,
        alert: {},
        cancelOrderDTO: {},

        product: {},
        level: 0
    }, methods: {
        numberFormat,
        formatDate,
        convertOrderStatus,
        orderConfirm,
        onOrderCancelClick: function(oIdx, pIdx) {
            this.currentProduct = this.orderList[oIdx].products[pIdx];
            
            getDeliveryGroupProduct(this.currentProduct);

            // openCancelModal();
        },
        openReivewWriteClick: function(oIdx, pIdx) {

            console.log("click");
            this.currentProduct = this.orderList[oIdx].products[pIdx];
            this.writableList = [this.currentProduct]
            this.writable.purchaseProductNo = this.currentProduct.purchaseProductNo
            
            console.log(this.currentReview)
            this.reviewModal = true
            scrollBlock();
        }, insertReviewComplete: function(data) {
            console.log("reviewComplete")
            location.reload();
        },
        onInquiryUpdateClick: function(index) {
            this.currentQuestion = this.questionList[index];
            var isChecked = this.currentQuestion.checkbox;

            this.currentQuestion.checkbox 
                = (isChecked != undefined && (isChecked == true || isChecked == 'Y'))?true:false;
            openInquiryModal()
        },
        onChildPopupClosed: function(popup, data) {
            if(popup === 'review') {

            }
            this.currentProduct

            this.reviewModal = false;
            this.deliveryModal = false;
            
            this.currentReview = {};
            this.currentQuestion = {};
        },
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




function updateDeliveryProgress(){

}

function openDInfoModal() {
app.deliveryInfoModalShow = true;
scrollBlock();
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
        getOrderList(app.userInfo);

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

function getDeliveryGroupProduct(product) {
    
    ajaxCall(API_SERVER + '/order/getDeliveryGroupProduct', product, 'POST',
    function(data) {
        app.cancelOrderDTO = data.result;

        var content = '';
        for(var i = 0; i < app.cancelOrderDTO.products.length; i++){
            var product = app.cancelOrderDTO.products[i];
            content += product.productName + '<br>';
        }
        content += '<br><br>위 상품을 주문 취소하시겠습니까?';

        app.alert = {
            title: '주문 취소 신청',
            content: content,
            buttonType: 'CONFIRM',
            callback: function() {
                openCancelModal();

                this.closeModal();   
            }
        }
        app.alertModalShow = true;
    },
    function(err) {
        console.log(err);
    })
}
