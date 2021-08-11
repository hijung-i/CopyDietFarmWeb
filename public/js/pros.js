
var app = new Vue({
    el: 'main',
    components: {
      //  'mypage-modal': signModal,
      //  'mypage-component': mypageComponent
    },
    data: {
        serviceType: '',
        accountNo: '',
        serviceTopic: ''
        , serviceDetail: ''
        , serviceLink: ''
        , accountClass:''
    }, methods: {
        onSubmit: function() {

            alert('manager - 001');
                
            // var component = this;

            var serviceDesc = $("#selectServiceDesc").val(); 
            var summDesc = $("#summDesc").val();
            var detailDesc = $("#detailDesc").val();
            var videoDesc = $("#videoDesc").val();
            var accountCode = $("#accountCode").val();
            var accountDesc = $("#accountDesc").val(); 

            if(serviceDesc == '' || serviceDesc == undefined || serviceDesc.trim() == ''){
                //TODO: Open alert modal
                alert('서비스 분야를 입력해주세요');
                return false;
            }   


            var params = {
                // userId: userId,
                // password: password
                serviceType  : serviceDesc,
                accountNo : accountDesc,
                serviceTopic : summDesc,
                serviceDetail : detailDesc,
                serviceLink : videoDesc,
                accountClass : accountCode
            }
            
            alert(serviceDesc)
            alert(summDesc)
            alert(detailDesc)
            alert(videoDesc)
            alert(accountCode)
            alert(accountDesc)
            

            ajaxCall(API_SERVER + '/user/insertManager', params, 'POST',
            function(data) {
                alert('전문가 모집 Pool 등록에 성공했습니다.');
                console.log("success ", data);
                component.updateSessionUser(params)
            }, function(err) {
                console.log("manager insert failed", err);
                },
            {
                // isRequired: true,
                // userId: true
            })
        },
    },
    created: function() {
        console.log("app load")
    }
})
    


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
    var summDesc = $("#summDesc").val();
    var detailDesc = $("#detailDesc").val();
    var videoDesc = $("#videoDesc").val();
    var accountCode = $("#accountCode").val();

    
    if(serviceDesc == '' || serviceDesc == undefined || serviceDesc.trim() == ''){
        //TODO: Open alert modal
        alert('서비스 분야를 입력해주세요');
        return false;
    }   

    /*
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
        serviceTopic : summDesc,
        serviceDetail : detailDesc,
        serviceLink : videoDesc,
        accountClass : accountCode,
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

//NICE 본인 인증 
    $(function() {
        var type = $('#type').val();
        
         if(type == 'K' || type == 'N') app.identified = true
         $('#btnNiceId').click(function () {
             var url = '/nice/identifying-page?nextMethod=register'
             var specs = 'width=500,hegiht,400,toolbar=no,menubar=no,scrollbars=no,resizable=yes'
             window.open(url, '본인인증', specs)
             return false;
         })

        })



