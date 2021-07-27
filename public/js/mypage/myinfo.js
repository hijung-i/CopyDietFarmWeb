var app = new Vue({
    el: 'main',
    components: {
        'mypage-modal': signModal,
        'mypage-component': mypageComponent
    },
    data: {
        userId: '',
        password: '',
        userEmail: '',
        totalPointAmount: 0,
        usableCouponAmount: 0
    }, methods: {
        login: function() {
           
            // if(this.userId == '' || this.userId == undefined || this.userId.trim() == ''){
            //     //TODO: Open alert modal
            //     alert('아이디를 입력해주세요');
            //     return false;
            // }   
            // if(this.password == '' || this.password == undefined || this.password.trim() == ''){
            //     //TODO: Open alert modal
            //     alert('비밀번호를 입력해주세요');
            //     return false;
            // } 

            // var params = {
            //     userId: this.userId,
            //     password: this.password
            // }
            // ajaxCall('/user/login', params, 'POST'
            // , function(data) {
            //     console.log('로그인 성공', data)
            // }, function(err) {
            //     console.log("login failed", err);
            //     var message = err.responseText;
            //     switch(message) {
            //     case 'NOT_MATCHED':
            //         alert('아이디 또는 비밀번호가 일치하지 않습니다.');
            //         break;
            //     case 'ERROR_SERVER':
            //         alert('알 수 없는 에러가 발생했습니다.');
            //     };
            // }),
            parsePointType,
            getUsableCouponList
            
        },
        keypress: function() {

        },
        onUpdateButtonClick: function(Idx) {
            this.userName = this.userName[Idx]
        }
    }, created: function() {
        var userId = document.getElementById('userId').value;
        this.userId = userId;
        var userEmail = document.getElementById('userEmail').value;
        this.userEmail = userEmail;
        var userName = document.getElementById('userName').value;
        this.userName = userName;
        var userCellNo = document.getElementById('userCellNo').value;
        this.userCellNo = userCellNo;
        var userInfo = document.getElementById('userInfo').value;
        this.userInfo = userInfo;
        var userGender = document.getElementById('userGender').value;
        this.userGender = userGender;
    }
})
    
$(function() {
    getUsablePointAmount();
    getUsableCouponList();
})

function getUsableCouponList() {
 
    ajaxCallWithLogin(API_SERVER + '/product/getCouponList', {}, 'POST', 
    function(data) {
        app.usableCouponAmount = data.result.length;
        console.log("get usableCouponList", data);
    }, function(err) {
        console.error("get usable coupon list ", err);
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


//회원정보수정

function updateDelivery(data) {

    ajaxCallWithLogin(API_SERVER + '/user/userName', data, 'POST',
    function(data) {
        alert('배송지 수정에 성공했습니다.');
        console.log("success ", data);
   
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}

//회원탈퇴
function deleteUserinfo(index) {
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