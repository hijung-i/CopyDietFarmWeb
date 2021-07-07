var app = new Vue({
    el: 'main',
    components: {
        'mypage-component': mypageComponent,
        'product-review-modal': productReviewModal
    },
    data: {
        RESOURCE_SERVER,
        reviewList: [],
        writableReviewList: [],
        totalPointAmount: 0,
        reviewModal: false,
        inquiryModal: false
    }, methods: {
        formatDate,
        getOptionName: function(options) {
            var optionName = options[0].optionDesc
            if(options.length > 1)  {
                optionName += '외 ' + (options.length -1) + '건';
            }
            return optionName;
        }
    },
    onReviewUpdateClick: function(index) {
        this.currentReview = this.reviewList[index];

        openReviewModal()
    },
    onChildPopupClosed: function(data) {
        this.reviewModal = false;
        this.inquiryModal = false; 

        this.currentReview = {};
        this.currentQuestion = {};
    },
})

$(function() {
    getQuestionList();
    getWritableReview();
});

function getQuestionList() {
    var params = {};

    ajaxCallWithLogin(API_SERVER + '/board/getReview', params, 'POST', 
    function (data) {
    
        app.reviewList = data.result;
        console.log("success", data);
    }, function (err){
        console.log("error while getReview", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function getWritableReview() {
    var params = {};

    ajaxCallWithLogin(API_SERVER + '/board/getWritableReview', params, 'POST', 
    function (data) {
    
        app.writableReviewList = data.result;
        console.log("success", data);
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
