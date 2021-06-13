var app = new Vue({
    el: 'main',
    data: {
        RESOURCE_SERVER,
        deliveryGroupList: '',
        paymentNo: 0,
        usablePoint: 0,
        orderDTO: '',
        deliveryDescType: 0,
        deliveryList: [],
        couponList: []
        
    }, methods: {
        
        numberFormat,
        paymentAction,
        descTypeChange: function() {
            var type = $("#selectDeliveryDesc")[0].options.selectedIndex;
            var value = $("#selectDeliveryDesc").val();
            
            if(type == 1) {
                $("#deliveryDesc").removeAttr("disabled");
                $("#deliveryDesc").removeAttr("readonly");
            } else if( type > 1){
                $("#deliveryDesc").removeAttr("disabled");
                $("#deliveryDesc").attr("readonly", "");
            } else if( type == 0) {
                $("#deliveryDesc").attr("disabled", "");
            }
            $('#deliveryDesc').val(value);
        },
        useAllPoint: function() {
            if(this.usablePoint <= ( this.orderDTO.paymentTotalAmount + this.orderDTO.totalDeliveryCost)) {
                this.orderDTO.paidPointAmount = this.usablePoint;
                this.remainingPoint = 0;
            } else if (this.usablePoint > ( this.orderDTO.paymentTotalAmount + this.orderDTO.totalDeliveryCost)) {
                this.orderDTO.paidPointAmount = ( this.orderDTO.paymentTotalAmount + this.orderDTO.totalDeliveryCost);
            }

        },
        pointChange: function() {
            var pointStr = new String(this.orderDTO.paidPointAmount).replace(/^[0~9]/gi, '');
            this.orderDTO.paidPointAmount = parseInt((pointStr == "")?'0':pointStr);
            
        },
        selectPayment: function() {

            $('.order_payment li').removeClass('border-orange')
            $('.order_payment li:nth-child('+ app.paymentNo +')').addClass('border-orange')
        },
        formatDate,
        applyCoupon,
        onDeliveryInfoSelected: function() {
            
            var checked = $('input[type=radio][name=list]:checked')
            app.orderDTO.delivery = app.deliveryList[checked.val()]

            closeInfoModal();
        }
    },
    computed: {
        remainingPoint: {
                get: function() {
                    var totalAmount = this.orderDTO.paymentTotalAmount + this.orderDTO.totalDeliveryCost - this.orderDTO.paidCouponAmount

                    var remainingPoint = this.usablePoint - this.orderDTO.paidPointAmount;
                    console.log(totalAmount, this.orderDTO.paidPointAmount)
                    if (totalAmount < this.orderDTO.paidPointAmount) {
                        console.log("greater than")
                        this.orderDTO.paidPointAmount = ( this.orderDTO.paymentTotalAmount + this.orderDTO.totalDeliveryCost);
                        remainingPoint = this.usablePoint - this.orderDTO.paidPointAmount;
                    } else if(remainingPoint < 0) {
                        this.orderDTO.paidPointAmount = this.usablePoint;
                        remainingPoint = 0;
                    }
                    
                    this.orderDTO.paidRealAmount = this.orderDTO.paymentTotalAmount - this.orderDTO.paidCouponAmount - this.orderDTO.paidPointAmount + this.orderDTO.totalDeliveryCost;
                    this.orderDTO.accumulatePoint = 0;
                    
                    for(var i = 0; i < this.deliveryGroupList.length; i++) {
                        var dGroup = this.deliveryGroupList[i];
                        for(var j = 0; j < dGroup.products.length; j++) {
                            var product = dGroup.products[j];

                            product.optionTotalPrice = 0;
                            for(var k = 0; k < product.options.length; k++){
                                var option = product.options[k];
                                product.optionTotalPrice += option.optionTotalPrice;
                            }

                            product.accumulatePoint = Math.round((this.orderDTO.paidRealAmount * (product.optionTotalPrice / this.orderDTO.paymentTotalAmount)) * 0.03)
                            this.orderDTO.accumulatePoint += product.accumulatePoint;    
                        }

                    }

                    return remainingPoint;
                },
                set: function(x) {
                    return x;
                }
        }
    }
})

$(function() {
    var deliveryGroupList = $('#deliveryGroupList').val();
    
    app.deliveryGroupList = JSON.parse(deliveryGroupList);
    app.orderDTO = JSON.parse((($('#orderDTO').val() != undefined)?$('#orderDTO').val():'{}'));

    app.orderDTO.products = new Array();
    for(var i = 0; i < app.deliveryGroupList.length; i++) {
        var dGroup = app.deliveryGroupList[i];
        app.orderDTO.products = dGroup.products;
    }

    var span = $(".close");                                       

    span.click(function() {
        $('#c_Modal').hide();
        $('#iModal').hide();
    });

    getLogin();
})

function getLogin() {
    ajaxCall('/user/login', '', 'GET', function(data){
        var isLoggedIn = data.result.isLoggedIn;

        if(isLoggedIn) {
            getDefaultDeliveryInfo();
            getUsablePointAmount();
            getUsableCouponList();
        }
        console.log("data", data);
    }, function(err){
        console.log("err", err);
    })
}

function getUsablePointAmount() {
    var params = {};
    ajaxCallWithLogin(API_SERVER + '/point/getUsablePointByUserId', params, 'POST',
    function(data) {
        app.usablePoint = data.result;

        console.log("success usablePoint", data);
    }, function(err) {
        console.log("error", err)
    },
    {
        isRequired: true,
        userId: true
    })
}

function paymentAction() {   
    var agreementPay = $('#agreementPay')[0].checked;

    if(agreementPay != true) {
        alert('구매 조건 및 결제 진행에 동의해야합니다.')
        return;
    }

    if(app.paymentNo == undefined || app.paymentNo == 0) {
        alert('결제 수단을 선택해주세요');
        return;
    }

    var orderTitle = orderTitle = app.deliveryGroupList[0].products[0].options[0].optionDesc;
    var methods = ['npay', 'vbank', 'kakao', 'card', 'phone'];
    var method = methods[app.paymentNo -1];
    var requestOrderDTO = {};

    requestOrderDTO.paymentNo = app.paymentNo;

    requestOrderDTO.userId = app.orderDTO.userId;
    requestOrderDTO.userName = app.orderDTO.userName;
    requestOrderDTO.userEmail = app.orderDTO.userEmail;
    requestOrderDTO.userCellNo = app.orderDTO.userCellNo;

    
    if(app.orderDTO.userId == '비회원주문') {
        requestOrderDTO.userName = $('#unName').val();
        requestOrderDTO.userCellNo = $('#unCellNo').val();
        requestOrderDTO.userEmail = $('#unEmail').val();
    }
    
    requestOrderDTO.delivery = app.orderDTO.delivery
    if(app.orderDTO.delivery == undefined) {
        var delivery = {
            userName: $('#unReceiverName').val(),
            address: $('#unAddr').val() + $('#unAddr2').val(),
            userCellNo: $('#unDeliveryUserCellNo').val()
        }
        requestOrderDTO.delivery = delivery;
    }
    requestOrderDTO.deliveryDesc = $("#selectDeliveryDesc").val();
    
    if($("#selectDeliveryDesc").val() == "") {
        requestOrderDTO.deliveryDesc = $('#deliveryDesc').val()
    }
    if(requestOrderDTO.userName == '' || requestOrderDTO.userName == undefined) {
        alert('주문자 이름을 입력해주세요');
        return;
    }
    if(requestOrderDTO.userCellNo == '' || requestOrderDTO.userCellNo == undefined) {
        alert('주문자 전화번호를 입력해주세요');
        return;
    }
    if(requestOrderDTO.userEmail == '' || requestOrderDTO.userEmail == undefined) {
        alert('주문자 이메일 주소를 입력해주세요');
        return;
    }
 
    var items = new Array();
    var count = 0;
;
    for(var i = 0; i < this.deliveryGroupList.length; i++) {
        var dGroup = this.deliveryGroupList[i];
        for(var j = 0; j < dGroup.products.length; j++) {
            var product = dGroup.products[j];
            for(var k = 0; k < product.options.length; k++) {
                var option = product.options[k];

                var item = {
                    item_name: option.optionDesc,
                    qty: option.optionCount,
                    unique: option.optionCode,
                    price: option.optionTotalPrice
                }
                count++;
                items.push(item);
            }
        }
    }
    if(count > 1){
        orderTitle += ' 외 '+ count + '건';
    }
    requestOrderDTO.orderTitle = orderTitle;

    var nowDate = new Date();
    var expireDate = new Date(nowDate.getTime() + (60 * 60 * 24 * 1000 * 3));

    var month = ((((expireDate.getMonth() + 1) / 10) >= 1)?expireDate.getMonth() + 1: '0'+(expireDate.getMonth() +1));
    var date = (((expireDate.getDate()) / 10) > 0)?expireDate.getDate(): '0'+(expireDate.getDate())
    
    var accountExpireAt = expireDate.getFullYear() + '-' + month +'-' + date  

    requestOrderDTO.paidRealAmount = app.orderDTO.paidRealAmount;

    var bootpayParams = {
        price: requestOrderDTO.paidRealAmount,
        application_id: "5feae25e2fa5c2001d0391b9",
        name: requestOrderDTO.orderTitle,
        pg: 'nicepay',
        method: method,
        show_agree_window: 0, // 부트페이 정보 동의 창 보이기 여부
        items: items,
        user_info: {
            username: requestOrderDTO.userId,
            email: requestOrderDTO.userEmail,
            addr: requestOrderDTO.address,
            phone: requestOrderDTO.userCellNo
        },
        order_id: 'ORDER_WEB', //고유 주문번호로, 생성하신 값을 보내주셔야 합니다.
        params: {

        },
        account_expire_at: accountExpireAt, // 가상계좌 입금기간 제한 ( yyyy-mm-dd 포멧으로 입력해주세요. 가상계좌만 적용됩니다. )
        extra: {
            vbank_result: 1, // 가상계좌 사용시 사용, 가상계좌 결과창을 볼지(1), 말지(0), 미설정시 봄(1)
            quota: [0,2,3], // 결제금액이 5만원 이상시 할부개월 허용범위를 설정할 수 있음, [0(일시불), 2개월, 3개월] 허용, 미설정시 12개월까지 허용,
            theme: 'purple', // [ red, purple(기본), custom ]
            custom_background: '#00a086', // [ theme가 custom 일 때 background 색상 지정 가능 ]
            custom_font_color: '#ffffff' // [ theme가 custom 일 때 font color 색상 지정 가능 ]
        }
    }
    requestOrderDTO.products = app.orderDTO.products;
    requestOrderDTO.paymentTotalAmount = app.orderDTO.paymentTotalAmount;
    console.log(requestOrderDTO, bootpayParams)
    

    BootPay.request(
        bootpayParams
    ).error(function (data) {
        //결제 진행시 에러가 발생하면 수행됩니다.
        console.log(data);
    }).cancel(function (data) {
        //결제가 취소되면 수행됩니다.
        console.log(data);
    }).ready(function (data) {
        // 가상계좌 입금 계좌번호가 발급되면 호출되는 함수입니다.
        console.log(data);
    }).confirm(function (data) {
        console.log(data);
        var enable = true; // 재고 수량 관리 로직 혹은 다른 처리
        if (enable) {
            BootPay.transactionConfirm(data); // 조건이 맞으면 승인 처리를 한다.
        } else {
            BootPay.removePaymentWindow(); // 조건이 맞지 않으면 결제 창을 닫고 결제를 승인하지 않는다.
        }
    }).close(function (data) {
        // 결제창이 닫힐때 수행됩니다. (성공,실패,취소에 상관없이 모두 수행됨)
        console.log(data);
    }).done(function (data) {
        //결제가 정상적으로 완료되면 수행됩니다
        //비즈니스 로직을 수행하기 전에 결제 유효성 검증을 하시길 추천합니다.
        console.log(data);
        
        requestOrderDTO.paymentName = data.payment_name;
        requestOrderDTO.paidRealAmount = data.price;
        requestOrderDTO.paidCouponAmount = app.orderDTO.paidCouponAmount;
        requestOrderDTO.paidPointAmount = app.orderDTO.paidPointAmount;
        requestOrderDTO.accumulatePoint = app.orderDTO.accumulatePoint;

        requestOrderDTO.paymentDate = data.purchased_at;
        requestOrderDTO.cardName = (data.card_name == undefined)?'':data.card_name;
        requestOrderDTO.cardNo = (data.card_no == undefined)?'':data.card_no;
        requestOrderDTO.cardQuota = (data.card_quota == undefined)?0:data.card_quota;

        requestOrderDTO.receiptId = data.receipt_id;

        paymentConfirm(requestOrderDTO);
    });
}

function paymentConfirm(requestOrderDTO) {
    var params = {
        applicationId: '5feae25e2fa5c2001d0391bc',
        privateKey: '#x1fCHsPFCxs#L#j#J#SsNpN7YPnyMF#0mk#6NCh0kVMub2sH#g='.replace(/#/gi, ''),
        receiptId: requestOrderDTO.receiptId,
        paidRealAmount: requestOrderDTO.paidRealAmount
    }

    ajaxCall(API_SERVER + '/order/paymentConfirm', params, 'POST',
    function(data) {
        console.log("success", data);
        switch(data.message) {
            case 'SUCCESS':
                addOrder(requestOrderDTO);
                break;
            case 'NOT_MATCHED':
                paymentCancel('paymentConfirm 실패', requestOrderDTO);
                break;
        }
    }, function(err){
        console.log("error", err);
    })
}

function paymentCancel(reason, requestOrderDTO) {
    var params = {
        applicationId: '5feae25e2fa5c2001d0391bc',
        privateKey: '#x1fCHsPFCxs#L#j#J#SsNpN7YPnyMF#0mk#6NCh0kVMub2sH#g='.replace(/#/gi, ''),
        receiptId: requestOrderDTO.receiptId,
        paidRealAmount: requestOrderDTO.paidRealAmount,
        name: requestOrderDTO.userName,
        reason: reason,
        cancel_id: Math.floor(new Date().getTime() + (Math.random() * 1000 + 1))
    }
    ajaxCall('https://api.bootpay.co.kr/cancel', params, 'POST', 
    function(data){
        console.log("payment canceled", data, 'params => ', params);
    }, function( err) {
        console.log("error while payment canceling", err, 'params = > ', params);
    })
}

function addOrder(requestOrderDTO) {
    ajaxCall(API_SERVER + '/order/addOrder', requestOrderDTO, 'POST',
    function(data) {
        console.log("success", data);
        switch(data.message) {
            case 'SUCCESS':
                alert('상품을 성공적으로 주문했습니다.');
                requestOrderDTO.orderNumber = data.result;
                location.href="/order-comp?requestOrderDTO="+JSON.stringify(requestOrderDTO);
                break;
            case 'NOT_MATCHED':
                alert('주문 실패, 취소 진행')
                paymentCancel('addOrder 실패', requestOrderDTO);
                break;
        }
    }, function(err){
        alert('주문 실패(err), 취소 진행')
        paymentCancel('addOrder 실패', requestOrderDTO);
        console.log("error", err);
    })
}

function getDefaultDeliveryInfo() {
    var params = {};

    ajaxCallWithLogin(API_SERVER + '/user/getDefaultDevlieryInfo', params, 'POST',
    function(data) {
        var result = data.result;
        var delivery = {
            address: result.address,
            addressName: result.addressName,
            deliveryNo: result.deliveryNo,
            userCellNo: result.userCellNo,
            userName: result.userName
        }
        app.orderDTO.delivery = delivery
        console.log("defaultDeliveryInfo success", data);
    }, function(err) {
        console.log("error", err);
        var responseText = err.responseText;
        if(responseText == 'NOT_FOUND') {
            app.orderDTO.delivery = undefined
        }
    }, {
        isRequired: true,
        userId: true
    })
}

function getDeliveryInfoList() {
    var params = {};

    ajaxCallWithLogin(API_SERVER + '/user/getDeliveryInfoByUserId', params, 'POST',
    function(data) {
        app.deliveryList = data.result;
        console.log("getDeliveryInfoList success", data);
    }, function(err) {
        console.log("error", err);
        var responseText = err.responseText;
        if(responseText == 'NOT_FOUND') {
            app.orderDTO.delivery = undefined
        }
    }, {
        isRequired: true,
        userId: true
    })
}

function openZipSearch() {
    new daum.Postcode({
        oncomplete: function(data) {
            $('#unAddr').val();
            var address = data.zonecode + ", " + data.roadAddress + " ("+ data.bname +") ";
            $('#unAddr').val(address);
        }
    }).open();
}

function getUsableCouponList() {
    
    ajaxCallWithLogin(API_SERVER + '/product/getCouponList', {}, 'POST', 
    function(data) {
        app.couponList = data.result;
        console.log("get usableCouponList", data);
    }, function(err) {
        console.error("get usable coupon list ", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function openCouponModal() {
    console.log("click")
    $('#c_Modal').show();
}

function closeCouponModal() {
    console.log("click")
    $('#c_Modal').hide();
}
   
function openInfoModal() {
    console.log("click")
    $('#iModal').show();
    
    getDeliveryInfoList();
}

function closeInfoModal() {
    console.log("click")
    $('#iModal').hide();
}
function openRegisterModal() {
    console.log("click")
    $('#rModal').show();
}

function closeRegisterModal() {
    console.log("click")
    $('#rModal').hide();
    $('#iModal').hide();
}

function applyCoupon(idx) {

}

function formatDate(strDate) {
    if(strDate != undefined && typeof(strDate) == typeof('')) {
        return strDate.substr(0, 10);
    }
    return ''
}