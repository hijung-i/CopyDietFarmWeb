var app = new Vue({
    el: '#app',
    components: {
        'mypage-modal': mypageModal
    },
    data: {
        deliveryList: new Array(),
    },
    methods: {
        getUsablePointAmount,
        getLogin
    }
})



$(function() {
    getLogin();
})


function getLogin() {
    ajaxCall('/user/login', '', 'GET', function(data){
        var isLoggedIn = data.result.isLoggedIn;

        if(isLoggedIn) {
            getUsablePointAmount();
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
        if(data.result)
            $('.point-amount span').html(numberFormat(data.result)+'원');

        console.log("success usablePoint", data);
    }, function(err) {
        console.log("error", err)
    },
    {
        isRequired: true,
        userId: true
    })
}
