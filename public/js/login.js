$(function() {
    $("button").click(function() {
        var id = $(this).attr("id");
        switch(id){
            case "btnLogin":
                loginRequest();
                break;
        }
    })

    $("#loginFormUserId, #loginFormUserPassword").keypress(function(event) {
        if(event.keyCode == 13){
            loginRequest();
        }
    })
})

function loginRequest(){
    console.log("login")
    var userId = $("#loginFormUserId").val();
    var password = $("#loginFormUserPassword").val();
 
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

    var params = {
        userId: userId,
        password: password
    }
    ajaxCall('/user/login', params, 'POST'
    , function(data) {
        console.log("login success", data);
        // TODO: Open alert moodal
        location.reload();
    }, function(err) {
        console.log("login failed", err);
        var message = err.responseText;
        switch(message) {
        case 'NOT_MATCHED':
            alert('아이디 또는 비밀번호가 일치하지 않습니다.');
            break;
        case 'ERROR_SERVER':
            alert('알 수 없는 에러가 발생했습니다.');
        };
    })
}