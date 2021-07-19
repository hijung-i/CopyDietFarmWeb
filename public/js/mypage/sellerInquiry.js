var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent
    },
    data: {
        RESOURCE_SERVER,
        askList: [],
        waitingAskList: [],
        doneAskList: [],
        totalPointAmount: 0
    }, methods: {
        formatDate,
        getOptionName: function(options) {
            var optionName = options[0].optionDesc
            if(options.length > 1)  {
                optionName += '외 ' + (options.length -1) + '건';
            }
            return optionName;
        }
    }
})

$(function() {
    getQuestionList();
    getUsablePointAmount();
    getUsableCouponList();
});

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

function getQuestionList() {
    var params = {};

    ajaxCallWithLogin(API_SERVER + '/board/getMyQuestionList', params, 'POST', 
    function (data) {
        console.log(data);
        app.askList = data.result;

        app.waitingAskList = app.askList.filter(function(val) {
            return val.answerState == 'N'
        }) 
        app.doneAskList = app.askList.filter(function(val) {
            return (val.answerState == 'Y')
        }) 
    }, function (err){
        console.log("error while getReview", err);
    }, {
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
