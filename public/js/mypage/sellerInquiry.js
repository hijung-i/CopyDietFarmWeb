var app = new Vue({
    el: '#main',
    data: {
        RESOURCE_SERVER,
        askList: [],
        waitingAskList: [],
        doneAskList: []
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
    getQuestionList()
});

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
