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

    $("#addr").click(function() {
        openZipSearch();
    })

    $("#addr").keydown(function() {
        openZipSearch();
        
        $(this).val('');
    })
    var height = window.innerHeight;
    var bottomUlHeight = $('.pages')[0].offsetHeight;
    $('.modal-background').css({
        height: height + bottomUlHeight
    })

    $(window).resize(function() {
        height = window.innerHeight;
        
        $('.modal-background').css({
            height: height + bottomUlHeight
        })
    })
})
function modalDisplay(display) {
    if(display) { 
        $('#ex1').show();
    } else {
        $('#ex1').hide();
    } 
}

function addDelivery() {
    var deliveryName = $('name')
    var newDeliveryInfo = {
        
    }

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

function openZipSearch() {
    new daum.Postcode({
        oncomplete: function(data) {
            var address = data.zonecode + ", " + data.roadAddress + " ("+ data.bname +") ";
            $('#addr').val(address);
            console.log(data);
        }
    }).open();
}
