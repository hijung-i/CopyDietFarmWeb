var  app = new Vue({
    el: 'main',
    components: {
        'mypage-modal': signModal
    }, data: {
        identified: false
    }
})

/*변수 선언*/
$(function() {
    var type = $('#type').val();
    if(type == 'K' || type == 'N') app.identified = true

    $('#btnNiceId').click(function () {
        var url = '/nice/identifying-page?nextMethod=register'
        var specs = 'width=500,hegiht,400,toolbar=no,menubar=no,scrollbars=no,resizable=yes'
    
        window.open(url, '본인인증', specs)
        return false;
    })

    $("#btnJoin").click(function (){
        var appleNo = $('#appleNo').val();
        var kakaoNo = $('#kakaoNo').val();
        var tokenNaver = $('#tokenNaver').val();
        
        var userId = $('#userId').val();
        if(userId == undefined && userId == '') {
            alert('잘못된 접근입니다.');
            location.href = "/"
            return;
        }

        var name = $("#userName").val();
        if(name === '') {
            alert('본인인증 정보가 없습니다.')
            return;
        }
        var userCellNo = $("#userCellNo").val();
        if(userCellNo === '') {
            alert('본인인증 정보가 없습니다.')
            return;
        }
        var userGender = $("#userGender").val();
        if(userGender === '') {
            alert('본인인증 정보가 없습니다.')
            return;
        }

        var password = $('#password').val();
        var userId = $('#userId').val();
        var email = $('#userEmail').val();

        var recommender = $("#recommender").val();

        var agreementAge = ($("#agreementAge")[0].checked)?'Y':'N';
        if(agreementAge == 'N') {
            alert('필수 약관에 동의해주세요.');
            return;
        }
        var agreementTos = ($("#agreementTos")[0].checked)?'Y':'N';
        if(agreementTos == 'N') {
            alert('필수 약관에 동의해주세요.');
            return;
        }
        var agreementPrivacy = ($("#agreementPrivacy")[0].checked)?'Y':'N';
        if(agreementPrivacy == 'N') {
            alert('필수 약관에 동의해주세요.');
            return;
        }
        
        var marketingAlert = ($("#mkt_agree")[0].checked)?'Y':'N';
        var agreementEmail = ($("#mkt_email")[0].checked)?'Y':'N';
        var agreementSms = ($("#mkt_sms")[0].checked)?'Y':'N';

        var userInfo = $('#userInfo').val();

        var params = {
            userId: userId,
            password: password,
            userEmail: email,
            userName: name,
            userInfo: userInfo,
            userGender: userGender,
            userCellNo: userCellNo,
            recommender: recommender,
            agreementTos: agreementTos,
            agreementAge: agreementAge,
            agreementPrivacy: agreementPrivacy,
            agreementPrivacyOptional: agreementEmail,
            agreementPrivacyOptional2: agreementSms,
            marketingAlert: marketingAlert
        }
        console.log(params);

        if(type === 'K') {
            params.kakaoNo = kakaoNo;
        } else if(type === 'N') {
            params.tokenNaver = tokenNaver;
        } else if (type === 'A') {
            params.appleNo = appleNo;
        }else {
            alert('잘못된 접근입니다.');
            location.href = '/';
            return;
        }

        if(!app.identified) {
            alert('본인 인증을 진행해주세요')
            return;
        }

        var mobile = /iphone|ipod|ipad|android/;
        var userAgent = window.navigator.userAgent.toLowerCase();
        params.accessPoint = 'P';
        
        if(mobile.test(userAgent)) {
            params.accessPoint = 'M';
        }
        ajaxCall('/user/register', params, 'POST', 
        function(data) {
            console.log("register success", data);
            alert("회원가입에 성공했습니다.");
            switch(type) {
                case 'K':
                    loginKakao(params);
                    break;
                case 'N':
                    loginNaver(params);
                    break;
            }    
        }, 
        function(err) {
            console.log(err);
            alert("회원가입에 실패했습니다.");
        });
    })

    $("input[type=checkbox]#all").click(function() {
        var checkboxes = $("input[type=checkbox]");
        $(this).checked = !$(this).checked;

        for(var i = 0; i < checkboxes.length; i++){   
            checkboxes[i].checked = this.checked;
        }    
    })

    $("input[type=checkbox]").change(function() {
        console.log(this.checked);
        if(!this.checked)
            $("input[type=checkbox]#all")[0].checked = false;
    });
    
    $("input[type=checkbox]#mkt_agree").change(function() {
        var mktBoxes = $("input[type=checkbox]#email, input[type=checkbox]#sms")
        for(var i = 0; i < mktBoxes.length; i++){
            mktBoxes[i].checked = this.checked;
        }
    })

    $("input[type=checkbox]#mkt_email, input[type=checkbox]#mkt_sms").change(function() {
        var mktBoxes = $("input[type=checkbox]#mkt_email, input[type=checkbox]#mkt_sms");
        var uncheckAll = true;
        for(var i = 0; i < mktBoxes.length; i++){
            var checkbox = mktBoxes[i];
            if( checkbox.checked ) uncheckAll = false;
        }

        $("input#mkt_agree")[0].checked = !uncheckAll;
    })

});

function onIdentifyingSuccess(params) {
    if( $('#userName').val() == undefined || $('#userName').val() == '') {
        $('#userName').val(params.userName)
    }

    $('#userInfo').val(params.userInfo)
    $('#userGender').val(params.userGender)
    $('#userCellNo').val(params.userCellNo)
    $('#dupInfo').val(params.dupInfo)

    duplicationCheck(params);
}

function duplicationCheck(params) {
    app.identified = false

    ajaxCall(API_SERVER + '/user/checkDuplicated', params, 'POST',
    function(data) {
        var result = data.result;
        switch(result) {
            case '탈퇴회원':
                alert('해당 명의는 탈퇴한 지 30일이 지나지 않아 가입할 수 없습니다.');
                location.href = '/';
                return false;
            case '정보존재':
                alert('동일한 명의로 이미 가입되어 있습니다.')
                location.href = '/';
                return false;
            case '가입가능':
                alert('본인인증이 완료되었습니다.')
                app.identified = true
                break;
        }
        console.log(data);
    }, function(err){
        console.log("error", err);
    })
}
