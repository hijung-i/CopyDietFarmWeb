
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
        },

    
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
    var summDesc = $("#summDesc").val();
    var detailDesc = $("#detailDesc").val();
    var videoDesc = $("#videoDesc").val();
    var accountCode = $("#accountCode").val();
    var profileImg = $("#thumbnailImg").val();
    var multiImg = $("#product_detail_image").val();
    var userEmail = $("#emailDesc").val();
 
    //유효성 검사 
    
    if(serviceDesc == '' || serviceDesc == undefined) {
        alert('제공 서비스 분야를 선택해주세요.');
        return;
    }
    if(summDesc == '' || summDesc == undefined) {
        alert('한 줄 소개 10-15자 이상을 입력해주세요.');
        return;
    }

    if(detailDesc == '' || detailDesc == undefined) {
        alert('경력 내용 상세 소개 50자 이상을 입력해주세요.')
        return;
    }
    if(userEmail == '' || userEmail == undefined) {
        alert('이메일 주소를 입력해주세요');
        return;
    }

    if(accountDesc == '' || accountDesc == undefined) {
        alert('계좌 번호를 입력해주세요.');
        return;
    }
    
    
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
        accountNo : accountDesc,
        serviceTopic : summDesc,
        serviceDetail : detailDesc,
        serviceLink : videoDesc,
        accountClass : accountCode,
        managerImage :  profileImg,
        managerServiceImage :  multiImg,
        userEmail : emailDesc
    }


    ajaxCall('/user/insertManager', params, 'POST'
    , function(data) {
        alert('문의 등록에 성공했습니다.');
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
    //다중이미지 업로드 및 미리보기
        function uploadImgPreview() {

            let fileInfo = document.getElementById("upImgFile").files[0];
            let reader = new FileReader();
      
            reader.onload = function() {      
                document.getElementById ("thumbnailImg").src = reader.result;
              };
             if( fileInfo ) {        
                reader.readAsDataURL( fileInfo );     
            }        
        }
    //프로필 사진 업로드 및 미리보기
        function setDetailImage(event){
            for(var image of event.target.files){
                var reader = new FileReader();
                
                reader.onload = function(event){
                    var img = document.createElement("img");
                    img.setAttribute("src", event.target.result);
                    img.setAttribute("class", "col-lg-6");
                    document.querySelector("div#images_container").appendChild(img);
                };
                
                console.log(image);
                reader.readAsDataURL(image);
            }
        }


