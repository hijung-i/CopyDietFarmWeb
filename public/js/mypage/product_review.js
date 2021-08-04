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
        product: {},
        optionTotalPrice: 0,
        orderDTO: {},
        deliveryGroupList: [],
        currentReview: {},
        writable: { purchaseProductNo: 0 },
        writableList: [],
        reviewList: [],
        reviewModal: false,
        currentQuestion: {},
        questionList: [],
        inquiryModal: false,
        recmdList: [],
        modal: []
    }, methods: {
        formatDate,
        getOptionName: function(options) {
            var optionName = options[0].optionDesc
            if(options.length > 1)  {
                optionName += '외 ' + (options.length -1) + '건';
            }
            return optionName;
        },
        closeModal: function() {
            this.$emit('close', 'review')
            scrollAllow();
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

function getReviewList() {
    var params = {
        productCode: app.product.productCode
    };

    ajaxCallWithLogin(API_SERVER + '/board/getReview', params, 'POST', 
    function (data) {
    
        app.reviewList = data.result;
        console.log("success", data);
    }, function (err){
        console.log("error while getReview", err);
    }, {
        isRequired: false,
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

function imgEnlarge(e){
    if(e.style.width=="104px" || e.style.width=="" ){
        e.style.width="300px";
        e.style.height="300px";
    }
    else{
        e.style.width="104px";
        e.style.height="104px";
    }
    var imgLength = document.getElementsByTagName('img').length;
    for(var i = 0; i<imgLength; i++){
        if(document.getElementsByTagName('img')[i].id==  e.id){
            continue;
        }
        document.getElementsByTagName('img')[i].style.width="104px";
    }
}