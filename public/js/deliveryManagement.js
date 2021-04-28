var app = new Vue({
    el: '#app',
    data: {
        deliveryList: new Array()
    },
    methods: {
        modalDisplay
    }

})

$(function() {
    getDeliveryInfoList();  
})
function modalDisplay(display) {
    if(display) $('#ex1').show();
    else $('#ex1').hide();
}

function addDelivery() {
    
    var params = {

    };
    
    ajaxCallWithLogin(API_SEVER + '/user/insertDeliveryInfo', params, 'POST',
    function(data) {
        console.log("success ", data);
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true
    })
}
function getDeliveryInfoList() {
    var params = {};
    ajaxCallWithLogin(API_SERVER + '/user/getDeliveryInfoByUserId', params, 'POST',
    function(data) {
        console.log("succes", data);
        app.deliveryList = data.result;
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}