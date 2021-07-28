var app = new Vue({
    el: 'main',
    components: {
        'mypage-modal': signModal,
        'mypage-component': mypageComponent
    },
    data: {
        userId: '',
        password: '',
        userEmail: ''
        , userGender: undefined
        , totalPointAmount: 0,
        usableCouponAmount: 0
    }, methods: {
        login: function() {
    
            getUsableCouponList
            
        },
        keypress: function() {

        },
        onSubmit: function() {
            var component = this;

            var params =  {
                name: this.userName,
                userInfo: this.userInfo
            };

            
        
            ajaxCallWithLogin(API_SERVER + '/user/updateUserInfo', params, 'POST',
            function(data) {
                alert('이름 수정에 성공했습니다.');
                console.log("success ", data);
                component.updateSessionUser(params)
            }, function(err) {
                console.log("login failed", err);
                },
            {
                isRequired: true,
                userId: true
            })
        },
        updateSessionUser: function(params) {
            ajaxCallWithLogin('/user/user', params, 'PUT', 
            function(data) {
                location.reload();
            }, function(err) {
                console.log(err);
            }, {
                isRequired: true,
                userId: true
            })
        }
    }, created: function() {
        this.userId = document.getElementById('userId').value;
        this.userEmail = document.getElementById('userEmail').value;
        this.userName = document.getElementById('userName').value;
        this.userCellNo = document.getElementById('userCellNo').value;
        this.userInfo = document.getElementById('userInfo').value;
        this.userGender = document.getElementById('userGender').value;
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
