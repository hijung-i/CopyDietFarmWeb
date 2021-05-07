
var app = new Vue({
    el: 'main',
    data: {
        RESOURCE_SERVER,
        deliveryGroupList: '',
        paymentNo: 0,
        usablePoint: 0,
        orderDTO: '',
        deliveryDescType: 0
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

            if(this.usablePoint <= this.orderDTO.paymentTotalAmount) {
                this.orderDTO.paidPointAmount = this.usablePoint;
                this.remainingPoint = 0;
            } else if (this.usablePoint > this.orderDTO.paymentTotalAmount) {
                this.orderDTO.paidPointAmount = this.orderDTO.paymentTotalAmount;
            }

        }
    },
    computed: {
        remainingPoint: {
                get: function() {
                    var remainingPoint = this.usablePoint - this.orderDTO.paidPointAmount;
                    if(remainingPoint < 0) {
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
    app.deliveryGroupList = JSON.parse((($('#deliveryGroupList').val() != undefined)?$('#deliveryGroupList').val():'{}'));
    app.orderDTO = JSON.parse((($('#orderDTO').val() != undefined)?$('#orderDTO').val():'{}'));

    // if(app.orderDTO.userId !== '비회원주문')
    getDefaultDeliveryInfo();
    getUsablePointAmount();

})

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
    var orderTitle = orderTitle = app.deliveryGroupList[0].products[0].options[0].optionDesc;
    var methods = ['npay', 'vbank', 'kakao', 'card', 'phone'];
    var method = methods[app.paymentNo -1];

    var items = new Array();
    var count = 0;
    for(var i = 0; i < this.deliveryGroupList.length; i++) {
        var dGroup = this.deliveryGroupList[i];
        console.log("dgroup -> ", this.deliveryGroupList.length, dGroup)
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
    app.orderDTO.orderTitle = orderTitle;

    var bootpayParams = {
        price: app.orderDTO.paidRealAmount,
        application_id: "5feae25e2fa5c2001d0391b9",
        name: app.orderDTO.orderTitle,
        pg: 'nicepay',
        method: method,
        show_agree_window: 0, // 부트페이 정보 동의 창 보이기 여부
        items: [],
        user_info: {
            username: app.orderDTO.userId,
            email: app.orderDTO.email,
            addr: app.orderDTO.address,
            phone: app.orderDTO.userCellNo
        },
        order_id: 'ORDER_WEB', //고유 주문번호로, 생성하신 값을 보내주셔야 합니다.
        params: {

        },
        account_expire_at: '2020-10-25', // 가상계좌 입금기간 제한 ( yyyy-mm-dd 포멧으로 입력해주세요. 가상계좌만 적용됩니다. )
        extra: {
            start_at: '2019-05-10', // 정기 결제 시작일 - 시작일을 지정하지 않으면 그 날 당일로부터 결제가 가능한 Billing key 지급
            end_at: '2022-05-10', // 정기결제 만료일 -  기간 없음 - 무제한
            vbank_result: 1, // 가상계좌 사용시 사용, 가상계좌 결과창을 볼지(1), 말지(0), 미설정시 봄(1)
            quota: '[0,2,3]', // 결제금액이 5만원 이상시 할부개월 허용범위를 설정할 수 있음, [0(일시불), 2개월, 3개월] 허용, 미설정시 12개월까지 허용,
            theme: 'purple', // [ red, purple(기본), custom ]
            custom_background: '#00a086', // [ theme가 custom 일 때 background 색상 지정 가능 ]
            custom_font_color: '#ffffff' // [ theme가 custom 일 때 font color 색상 지정 가능 ]
        }
    }
    

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
        app.orderDTO.paymentName = data.payment_name;
        app.orderDTO.paidRealAmount = data.price;
        app.orderDTO.paymentDate = data.purchased_at;
        app.orderDTO.cardName = (data.card_name == undefined)?'':data.card_name;
        app.orderDTO.cardNo = (data.card_no == undefined)?'':data.card_no;
        app.orderdTO.cardQuota = (data.card_quota == undefined)?0:data.card_quota;

        app.orderDTO.receiptId = data.receipt_id;
    });
}

function paymentConfirm() {
    var parmas = {
        applicationId: '5feae25e2fa5c2001d0391b9',
        privateKey: '#x1fCHsPFCxs#L#j#J#SsNpN7YPnyMF#0mk#6NCh0kVMub2sH#g='.replace(/#/gi, ''),
        receiptId: app.orderDTO.receiptId,
        paidRealAmount: app.orderDTO.paidRealAmount
    }

    ajaxCall(API_SERVER + '/order/paymentConfirm', params, 'POST',
    function(data) {
        console.log("success", data);
        switch(data.message) {
            case 'SUCCESS':
                addOrder();
                break;
            case 'NOT_MATCHED':
                paymentCancel();
                break;
        }
        addOrder();
    }, function(err){
        console.log("error", err);
    })
}

function getDefaultDeliveryInfo() {
    var params = {

    };

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
    }, {
        isRequired: true,
        userId: true
    })
}