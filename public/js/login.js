$(function() {

    $("button").click(function() {
        var id = $(this).attr("id");
        switch(id){
            case "btnLogin":
                loginRequest();
                break;
        }
    })
})

function loginRequest(){
    var userId = $("#loginFormUserId").val();
    var password = $("#loginFormUserPassword").val();
 
    if(userId == '' || userId == undefined || userId.trim() == ''){
        //TODO: Open alert modal
        return false;
    }   
    if(password == '' || password == undefined || password.trim() == ''){
        //TODO: Open alert modal
        return false;
    } 

    var params = {
        userId: userId,
        password: password
    }
    ajaxCall(API_SERVER + '/user/login', params, 'POST'
    , function(data) {
        console.log("login success", data);
    }, function(err) {
        console.log("login failed", err);
    })
}