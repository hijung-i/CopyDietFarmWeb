
var app = new Vue({
    el: 'main',
    components: {

    },
    data: {
        ServiceDescType: 0,

    }, methods: {
 
        descTypeChange: function() {
            var type = $("#selectServiceDesc")[0].options.selectedIndex;
            var value = $("#selectServiceDesc").val();
            
            if(type == 1) {
                $("#ServiceDesc").removeAttr("disabled");
                $("#ServiceDesc").removeAttr("readonly");
            } else if( type > 1){
                $("#ServiceDesc").removeAttr("disabled");
                $("#ServiceDesc").attr("readonly", "");
            } else if( type == 0) {
                $("#ServiceDesc").attr("disabled", "");
            }
            $('#ServiceDesc').val(value);
        }
    
    }
});



$(function() {
    $("button").click(function() {
        var id = $(this).attr("id");
        switch(id){
            case "btnSubmit":
                submitRequest();
                break;
        }
    })

    //$("#loginFormUserId, #loginFormUserPassword").keypress(function(event) {
    //    if(event.keyCode == 13){
    //        loginRequest();
    //    }
    //})
})

function submitRequest(){
    console.log("manager registration submit")
    //var userId = $("#loginFormUserId").val();
    //var password = $("#loginFormUserPassword").val();

    var serviceDesc = $("#selectServiceDesc").val(); 
    var accountDesc = $("#accountDesc").val(); 

    /*
    if(userId == '' || userId == undefined || userId.trim() == ''){
        //TODO: Open alert modal
        alert('아이디를 입력해주세요');
        return false;
    }   
    if(password == '' || password == undefined || password.trim() == ''){
        //TODO: Open alert modal
        alert('비밀번호를 입력해주세요');
        return false;
    } 
    */

    var params = {
        // userId: userId,
        // password: password
        serviceType  : serviceDesc,
        accountNo : accountDesc
    }


    ajaxCall('/user/insertManager', params, 'POST'
    , function(data) {
        console.log("manager insert success", data);
        // TODO: Open alert moodal
        location.reload();
    }, function(err) {
        console.log("manager insert failed", err);
        var message = err.responseText;
        switch(message) {
        case 'ERROR_SERVER':
            alert('알 수 없는 에러가 발생했습니다.');
        };
    })


}



