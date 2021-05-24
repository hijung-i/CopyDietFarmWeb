

/*변수 선언*/
$(function() {
    //niceDuplicationCheck();
    
    var id = $('#id');
    var pw1 = $('#pswd1');
    var pwMsg = document.querySelectorAll('#alertTxt');
    var pwImg1 = document.querySelectorAll('#pswd1_img1');

    var pw2 = $('#pswd2');
    var pwImg2 = document.querySelectorAll('#pswd2_img1');
    var pwMsgArea = document.querySelectorAll('.int_pass');

    var emailInput = $('#email');
    var error = document.querySelectorAll('.error_next_box');

    /*이벤트 핸들러 연결*/
    id.change(checkId)
    pw1.focusout(checkPw);
    pw2.focusout(comparePw);
    emailInput.focusout(isEmailCorrect);
    
    $("#btnJoin").click(function (){
        
        var kakaoNo = $('#kakaoNo').val();
        var tokenNaver = $('#tokenNaver').val();
        
        var name = $("#userName").val();
        if(name === '') {
            alert('본인인증 정보가 없습니다.')
            return;
        }
        var userInfo = $("#userInfo").val();
        if(userInfo === '') {
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

        if(kakaoNo != undefined && kakaoNo != '') {
            params.kakaoNo = kakaoNo;
        } else if(tokenNaver != undefined && tokenNaver != '') {
            params.tokenNaver = tokenNaver;
        } else {
            alert('잘못된 접근입니다.');
            location.href = '/';
        }

        ajaxCall('/user/register', params, 'POST', 
        function(data) {
            console.log("register success", data);
            alert("회원가입에 성공했습니다.");
            location.href = "/login-form";
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

  
    $("#btnCheckIdDuplicate").click(function () {
        duplicationCheck();
    });
    
    
    /*콜백 함수*/
    function isEmailCorrect() {

    }

    function checkId() {
        dupCheck = false;
        var idPattern = /[a-zA-Z0-9_-]{5,20}/;
        if(id.val() === "") {
            error[0].innerHTML = "필수 정보입니다.";
            error[0].style.display = "block";
        } else if(!idPattern.test(id.val())) {
            error[0].style.display = "block";
        } else {
            error[0].style.color = "#EFA543";
            error[0].style.display = "block";
        }
    }

    function checkPw() {
        var pwPattern = /[a-zA-Z0-9~!@#$%^&*()_+|<>?:{}]{8,16}/;
        if(pw1.val() === "") {
            error[1].innerHTML = "필수 정보입니다.";
            error[1].style.display = "block";
        } else if(!pwPattern.test(pw1.val())) {
            error[1].innerHTML = "8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.";
            pwMsg.innerHtml = "사용불가";
            pwMsgArea.style.paddingRight = "93px";
            error[1].style.display = "block";
            
            pwMsg.style.display = "block";
        } else {
            error[1].style.display = "none";
            pwMsg.innerHTML = "안전";
            pwMsg.style.display = "block";
            pwMsg.style.color = "#EFA543";
            pwImg1.src = "m_icon_safe.png";
        }
    }

    function comparePw() {
        if(pw2.value === pw1.value && pw2.value != "") {
            pwImg2.src = "m_icon_check_enable.png";
            error[2].style.display = "none";
        } else if(pw2.value !== pw1.value) {
            pwImg2.src = "m_icon_check_disable.png";
            error[2].innerHTML = "비밀번호가 일치하지 않습니다.";
            error[2].style.display = "block";
        } 

        if(pw2.value === "") {
            error[2].innerHTML = "필수 정보입니다.";
            error[2].style.display = "block";
        }
    }

    function checkName() {
        var namePattern = /[a-zA-Z가-힣]/;
        if(userName.value === "") {
            error[3].innerHTML = "필수 정보입니다.";
            error[3].style.display = "block";
        } else if(!namePattern.test(userName.value) || userName.value.indexOf(" ") > -1) {
            error[3].innerHTML = "한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)";
            error[3].style.display = "block";
        } else {
            error[3].style.display = "none";
        }
    }


    function isBirthCompleted() {
        var yearPattern = /[0-9]{4}/;

        if(!yearPattern.test(yy.value)) {
            error[4].innerHTML = "태어난 년도 4자리를 정확하게 입력하세요.";
            error[4].style.display = "block";
        } else {
            isMonthSelected();
        }


        function isMonthSelected() {
            if(mm.value === "월") {
                error[4].innerHTML = "태어난 월을 선택하세요.";
            } else {
                isDateCompleted();
            }
        }

        function isDateCompleted() {
            if(dd.value === "") {
                error[4].innerHTML = "태어난 일(날짜) 2자리를 정확하게 입력하세요.";
            } else {
                isBirthRight();
            }
        }
    }



    function isBirthRight() {
        var datePattern = /\d{1,2}/;
        if(!datePattern.test(dd.value) || Number(dd.value)<1 || Number(dd.value)>31) {
            error[4].innerHTML = "생년월일을 다시 확인해주세요.";
        } else {
            checkAge();
        }
    }

   function niceDuplicationCheck() {
        var dupInfo = $("#dupInfo").val();
        if(dupInfo == undefined || dupInfo == '') {
            alert('잘못된 접근입니다.');
            location.href="/";
        }

        var params = {
            dupInfo
        }

        ajaxCall(API_SERVER + '/user/checkDuplicated', params, 'POST',
        function(data) {
            var result = data.result;
            switch(result) {
                case '중복':
                    alert('동일한 명의로 이미 가입되어 있습니다.');
                    location.href = '/';
                    return false;
                case '탈퇴회원':
                    alert('해당 명의는 탈퇴한 지 30일이 지나지 않아 가입할 수 없습니다.');
                    location.href = '/';
                    return false;
                case '정보존재':
                    alert('알 수 없는 에러가 발생했습니다.')
                    location.href = '/';
                    return false;
                case '가입가능':
                    break;
            }
            console.log(data);
        }, function(err){
            console.log("error", err);
        })
    }

    function duplicationCheck() {
        var userId = $('#id').val();
        if(userId == ''){
            alert('아이디를 입력하세요.');
            return;
        }
        var params = {
            userId
        }

        ajaxCall(API_SERVER + '/user/checkDuplicatedId', params, 'POST',
        function(data) {
            if(data.message == 'SUCCESS' && (
                data.result == '중복' || data.result == '탈퇴회원'
            )) {
                alert('동일한 아이디가 이미 있습니다.');
            } else if(data.message == 'SUCCESS' && data.result == '가입가능'){
                alert('사용 가능한 아이디입니다.');
                dupCheck = true;
            } else {
                alert('알 수 없는 오류가 발생했습니다.');
            }
        }, function(err){
            console.log("err", err);
        })
    }
});
