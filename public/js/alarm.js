$(function() {
    
    if($('#userId').length > 0) {
        selectAlarmSettings();
        $('input[type=checkbox]').change(function() {
            updateAlarmSettings();    
        })
    } else {
        alert('로그인이 필요한 페이지입니다.')
        location.href="/login-form";
    }
})

function selectAlarmSettings() {
    var userId = $('#userId').val();
    ajaxCall(API_SERVER + '/user/alarm/' + userId, {}, 'GET', 
    function(data) {
        var result = data.result;
        $('input#serviceAlert')[0].checked = (result.serviceAlert == 'Y')
        $('input#marketingAlert')[0].checked = (result.marketingAlert == 'Y')

        console.log("success selectAlarm", data);
    }, function(err) {
        console.error('error selectAlarm', err);
    })
}

function updateAlarmSettings(params) {
    var serviceAlert = ($('input#serviceAlert')[0].checked)?'Y':'N';
    var marketingAlert = ($('input#marketingAlert')[0].checked)?'Y':'N';
    
    var params = {
        serviceAlert,
        marketingAlert
    }

    ajaxCallWithLogin(API_SERVER + '/user/alarm', params, 'POST', 
    function(data) {
        alert('저장되었습니다.');
        console.log("success udpateAlarm", data);
    }, function(err) {
        console.error('error updateAlarm', err);
    }, {
        isRequired: true,
        userId: true
    })
}