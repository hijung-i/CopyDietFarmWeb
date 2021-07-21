
var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent,
        'delivery-register-modal': deliveryRegisterModalComponent
    },
    data: {
        deliveryList: new Array(),
        totalPointAmount: 0,
        deliveryRegisterModalShow: false,
        delivery: {}
    },
    methods: {
        deleteDelivery,
        changeMainAddress,
        onUpdateButtonClick: function(dIdx) {
            this.delivery = this.deliveryList[dIdx]

            openRegisterModal();
        }
    }
})

$(function() {
    getUsablePointAmount();
    getUsableCouponList();
    getDeliveryInfoList();

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
function deleteDelivery(index) {
    var selectedDeliveryNo = app.deliveryList[index].deliveryNo;

    var params = {
        deliveryNo: selectedDeliveryNo
    }
    
    ajaxCallWithLogin(API_SERVER + '/user/deleteDelivery', params, 'POST',
    function(data) {
        alert('배송지 삭제에 성공했습니다.');
        console.log("success ", data);
        
        app.deliveryRegisterModalShow = false
        scrollAllow();
        
        getDeliveryInfoList();
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function changeMainAddress(index) {
    var selectedDeliveryNo = app.deliveryList[index].deliveryNo;

    var params = {
        deliveryNo: selectedDeliveryNo
    }
    
    ajaxCallWithLogin(API_SERVER + '/user/updateDeliveryMainAddress', params, 'POST',
    function(data) {
        alert('기본 배송지 변경에 성공했습니다.');
        app.deliveryRegisterModalShow = false
        scrollAllow();
        getDeliveryInfoList();
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function getDeliveryInfoList() {
    ajaxCallWithLogin(API_SERVER + '/user/getDeliveryInfoByUserId', {}, 'POST',
    function(data) {
        app.deliveryList = data.result;

    }, function(err) {
        if(err.responseText === 'NOT_FOUND') {
            console.log("배송지 정보 없음")
        } else {
            console.log("err", err);
        }
    }, {
        isRequired: true,
        userId: true
    })
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