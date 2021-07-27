var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent
    },
    data: {
        totalPointAmount: 0,
        pointList: [],
        usableCouponAmount: 0,
        userId: '',
        password: '',
        userEmail: ''
    },
    methods: {
        numberFormat,
        formatDate,
        getUsableCouponList,
        deleteUser

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
    getPointHistory();
    getUsableCouponList();
    deleteUser();
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

function formatDate(strDate) {
    if(strDate != undefined && typeof(strDate) == typeof('')) {
        return strDate.substr(0, 10);
    }
    return ''
}

function getPointHistory() {
    ajaxCallWithLogin(API_SERVER + '/point/getPointDetailListByUserId', {},
    'POST',
    function(data) {
        console.log(data);
        app.pointList = data.result;
    
    },function(err) {
        console.error(err);
    }, {
        isRequired: true,
        userId: true
    })
}
//회원탈퇴

function deleteUser() {
    var params = {
        userId: userId
    };
    ajaxCallWithLogin(API_SERVER + '/user/withdrawal', params, 'POST',
     function(data) {
        var userId = document.getElementById('userId').value;
        this.userId = userId;
        console.log(data);
        alert('회원정보가 삭제되었습니다.');
      
    }, function(err) {
        console.log("error", err);
    }, {
        isRequired: true,
        userId: true
    })
}

   