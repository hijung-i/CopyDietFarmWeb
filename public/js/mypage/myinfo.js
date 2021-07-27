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
    
            getUsableCouponList
            
        },
        keypress: function() {

        },

        onSubmit: function() {
            
            var userName = Object.assign({}, this.currentuserName);
            if (userName.currentuserName == undefined) {
              updateDelivery(delivery);
            }
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
    updateUserName();
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

function updateUserName() {
   
    var params =  {
        userName: userName
    };
    var userName = $("#userName").val();
     ajaxCallWithLogin(API_SERVER + '/data/userName', params, 'POST',
    function(data) {
        
        alert('이름 수정에 성공했습니다.');
        console.log("success ", data);
   
    }, function(err) {
        console.log("login failed", err);
      },
    {
        isRequired: true,
        userId: true
    })
}