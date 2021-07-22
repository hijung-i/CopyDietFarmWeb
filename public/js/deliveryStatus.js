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
        deliveryModal: false,
        beforeDeliveryCount: 0,
        currentReview: {},
        onDeliveryCount: 0,
        afterDeliveryCount: 0,
        product: {},
        productName:0,
        courierName: 0,
        courierNo: 0
    }, methods: {
        numberFormat,
        formatDate,
        convertOrderStatus
    }, computed:{
      deliveryListURL: function(){
        Object.assign(params, this.product);
    }
    }
})

$(function() {
    getOrderList();
    getUsablePointAmount();
    getUsableCouponList();
    convertOrderStatus();
    setDeliveryComplete();
    getDeliveryInfo();
    updateDeliveryTime();
    pushStartDelivery();



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

function formatDate(dateStr) {
    var date = new Date(dateStr);
    var month = '' + (date.getMonth() + 1);
    month = (month.length < 2)?'0'+month: month;
    
    var day = '' + (date.getDate());
    day = (day.length < 2)?'0'+day: day;
    return month + '-' + day;
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

// function getDeliveryInfo(){
//     ajaxCallWithLogin(API_SERVER + '/product/getDeliveryInfo', {}, 'POST',
//     function(data) {
//         app.DeliveryInfo = data.result.length;
// 
//         var lastDetail = deliveryInfo.lastDetail;
//         var firstDetail = deliveryInfo.firstDetail;
//      })
// }
  function setDeliveryComplete() {
      const HOST = 'http://info.sweettracker.co.kr/api/v1';
      const companyListOpt = {
        headers: { 'Content-Type': 'application/json' },
        url: HOST + '/companylist',
        qs: {
          t_key : deliveryKey
        }
      };
  
      var trackingOpt = {
        headers: { 'Content-Type': 'application/json' },
        url: HOST + '/trackingInfo',
        qs: {
          t_key : deliveryKey,
          t_code : null,
          t_invoice : null
        }
      };
  
    
      for (var i = 0; i < result1.length; i++) {
        if(result1[i].courierNo != "") {
          var courierNo = result1[i].courierNo
          var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
          if(regExp.test(courierNo)) {
            result1[i].courierNo = courierNo.replace(regExp, "");
          }
        }
      }
  
      //택배사별 ID받아오기
      request(companyListOpt, function (err, res, result) {
        if (res && !err && res.statusCode == 200) {
          const carriers = JSON.parse(result);
          const companylist = carriers.Company;
  
          //API가 지원하는 택배사가 있으면 해당 운송장번호를 추적
          for (var i = 0; i < result1.length; i++) {
            for (var j = 0; j < companylist.length; j++) {
              if (result1[i].courierName != "" && result1[i].courierNo != "") {
                if (result1[i].courierName.replace(/(\s*)/g, "") == companylist[j].Name.replace(/(\s*)/g, "")) {
                  trackingOpt.qs.t_code = companylist[j].Code
                  trackingOpt.qs.t_invoice = result1[i].courierNo
                  const start = async function () {
                    await getDeliveryInfo(conn, trackingOpt, result1[i]);
                  }
                  start();
                  break;
                }
              }
            }
          }
        }
        else {
          console.log("ERROR DELIVERY API");
        }
      }).end();
  
    }

  
//제품의 배송상태 받아오기
const getDeliveryInfo = async (conn, options, purchaseInfo) => {
    request(options, function (err, res, result) {
      if (res && !err && res.statusCode == 200) {
        const deliveryInfo = JSON.parse(result);
   
        var lastDetail = deliveryInfo.lastDetail;
        var firstDetail = deliveryInfo.firstDetail;
        
        if (!typeChecker.isAvailable(purchaseInfo.deliveryStartDate)) {
          if(firstDetail != null && new Date(firstDetail.timeString) != "Invalid Date") {
            const startDate = firstDetail.timeString;
            let start = async function () {
              await updateDeliveryTime(conn, startDate, purchaseInfo, true);
            }
            start(); 
          }
        }
  
        if (lastDetail != null && lastDetail.level >= 6) {
          const completeDate = lastDetail.timeString;
          if (completeDate != null && new Date(completeDate) != "Invalid Date") {
            let start = async function () {
              await updateDeliveryTime(conn, completeDate, purchaseInfo, false);
            }
            start();
          }
        }
      }
    }).end();
  }
  
  
  const updateDeliveryTime = async (conn, deliveryDate, purchaseInfo, isStart) => {
    const data = {
      time: deliveryDate,
      purchaseProductNo: purchaseInfo.purchaseProductNo
    };
  
    let result2;
    if (isStart) {
      result2 = await orderDAO.updateDeliveryStart(conn, data);
    }
    else {
      result2 = await orderDAO.updateDeliveryComplete(conn, data);
    }
  
    if (result2 == 0) {
      if (isStart) {
        console.log("배송시작시간 업데이트 실패 =>", data);
      }
      else {
        console.log("배송완료시간 업데이트 실패 =>", data);
      }
    }
    else {
      await pushStartDelivery(purchaseInfo, isStart);
    }
  
  }
  
  const pushStartDelivery = async (res, isStart) => {
    if (res != null) {
      if (isStart) {
        var title = "배송시작"
        var body = res.productName + " 상품이 배송시작되었습니다."
      }
      else {
        var title = "배송완료"
        var body = res.productName + " 상품이 배송완료되었습니다."
      }
  
      var fcm_message = {
        data: {
          title: title,
          body: body,
          getMove: '',
          product_code: '',
          img: '',
          courierNo: res.courierNo,
          courierName: res.courierName
        },
        to: res.registrationtokens
      }
  
      console.log("token, fcm_message", fcm_message);
      await fcm.send(fcm_message)
        .then(async function (response) {
          if (response.error) {
            throw Error("배송정보 메시지 실패", response.error);
          }
        })
        .catch(function (error) {
          console.log('배송정보 메시지 실패:', error);
        });
  
    }
  }
  