var app = new Vue({
    el: '#app',
    components: {
        'mypage-component': mypageComponent
    },
    data: {
        deliveryList: new Array(),
        totalPointAmount: 0
    },
    methods: {
        modalDisplay,
        deleteDelivery,
        changeMainAddress
    }
})

$(function() {

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

    $('#btnRegister_modal').click(function() {
        var modalName = $('.deliver_magHeader h3').html();
        console.log(modalName);
        switch(modalName) {
            case '배송지 수정':
                updateDelivery();
                break;
            case '배송지 등록':
                addDelivery();
                break;
        }
    })
    $('#btnRegister').click(function() {
        addDelivery();
        
    })
    getDeliveryInfoList();

})
function modalDisplay(display, modalName, i) {
    console.log("click", display, modalName)
    if(display) {
        $('.deliver_magHeader h3').html(modalName);
        if(i != undefined) {
            var deliveryInfo = app.deliveryList[i];
            $('#selectedDeliveryNo').val(deliveryInfo.deliveryNo);
            $('#mainAddressYn').val(deliveryInfo.mainAddressYn);
            $('#deliveryName').val(deliveryInfo.addressName);
            $('#receiverName').val(deliveryInfo.userName);
            $('#addr').val('');
            $('#userCellNo').val(deliveryInfo.userCellNo);
        }

        $('.modal-background').addClass("on");
        $('.deliver_mag_modal').addClass("on");

    } else {
        $('.modal-background').removeClass("on");
        $('.deliver_mag_modal').removeClass("on");
        
        $('#selectedDeliveryNo').val('');
        $('#deliveryName').val('');
        $('#receiverName').val('');
        $('#addr').val('');
        $('#addr2').val('');
        $('#userCellNo').val('');

    } 
}

function addDelivery() {
    var deliveryName = $('#deliveryName').val();
    var receiverName = $('#receiverName').val();
    var address = $('#addr').val();
    var address2 = $('#addr2').val();
    var userCellNo = $('#userCellNo').val();

    console.log(address, address2);
    address = address + address2;
    var newDeliveryInfo = {
        userName: receiverName,
        address,
        userCellNo,
        addressName: deliveryName,
        mainAddressYn: 'N'
    }

    
    ajaxCallWithLogin(API_SERVER + '/user/insertDeliveryInfo', newDeliveryInfo, 'POST',
    function(data) {
        alert('배송지 추가에 성공했습니다.');
        console.log("success ", data);
        modalDisplay(false);
        
        getDeliveryInfoList();
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function updateDelivery() {
    
    var selectedDeliveryNo = $('#selectedDeliveryNo').val();
    var mainAddressYn = $('#mainAddressYn').val();
    var deliveryName = $('#deliveryName').val();
    var receiverName = $('#receiverName').val();
    var address = $('#addr').val();
    var address2 = $('#addr2').val();
    var userCellNo = $('#userCellNo').val();

    console.log(address, address2);
    address = address + address2;
    var newDeliveryInfo = {
        deliveryNo: selectedDeliveryNo,
        userName: receiverName,
        address,
        userCellNo,
        addressName: deliveryName,
        mainAddressYn: mainAddressYn
    }
    
    ajaxCallWithLogin(API_SERVER + '/user/updateDelivery', newDeliveryInfo, 'POST',
    function(data) {
        alert('배송지 수정에 성공했습니다.');
        console.log("success ", data);
        modalDisplay(false);
        
        getDeliveryInfoList();
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function deleteDelivery(index) {
    var selectedDeliveryNo = app.deliveryList[index].deliveryNo;

    var params = {
        deliveryNo: selectedDeliveryNo
    }
    
    ajaxCallWithLogin(API_SERVER + '/user/deleteDelivery', params, 'POST',
    function(data) {
        alert('배송지 삭제에 성공했습니다.');
        console.log("success ", data);
        modalDisplay(false);
        
        getDeliveryInfoList();
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function changeMainAddress(index) {
    var selectedDeliveryNo = app.deliveryList[index].deliveryNo;

    var params = {
        deliveryNo: selectedDeliveryNo
    }
    
    ajaxCallWithLogin(API_SERVER + '/user/updateDeliveryMainAddress', params, 'POST',
    function(data) {
        alert('기본 배송지 변경에 성공했습니다.');
        console.log("success ", data);
        modalDisplay(false);
        
        getDeliveryInfoList();
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}


function getDeliveryInfoList() {
    var params = {};
    ajaxCallWithLogin(API_SERVER + '/user/getDeliveryInfoByUserId', params, 'POST',
    function(data) {
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