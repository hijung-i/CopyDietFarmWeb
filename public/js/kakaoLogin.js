// kakao 계정 로그인 순서1번
// function loginWithKakaoApi() {
    // Kakao.Auth.authorize({
	// 	success: function(authObj) {
	// 		console.log("success", authObj)
	// 		if(authObj != undefined) {
    //             alert('로그인')
	// 			requestKaKaoUserInfo();
	// 		} else {
    //             alert('실패', err);
	// 			alert('KAKAO 계정으로 로그인에 실패했습니다.');
	// 		}
	// 	},
	// 	fail: function(err) {
	// 		console.log("err", err);
    //         alert('로그인 실패', err)
	// 		if(err) {
	// 			alert('KAKAO 계정으로 로그인에 실패했습니다.');
	// 			return;
	// 		}
	// 	},
    // })
// }

// 카카오계정 로그인 이후 유저 정보 요청
function requestKaKaoUserInfo() {
    alert('requestKakaoUserInfo')
	Kakao.API.request({
		url: '/v2/user/me',
		success: function(res) {
			console.log(res)
			var account = res.kakao_account;

			var agreement = false;
			if (account.birthday_needs_agreement == true ) {
				agreement = true;
			}
			if (account.birthyear_needs_agreement == true ) {
				agreement = true;
			}
			if (account.gender_needs_agreement == true ) {
				agreement = true;
			}

			if(agreement) {
				alert('선택 정보에 동의해주셔야 회원가입이 가능합니다.');
				kakaoUnlink();
				return;
			}

			var params = {
				kakaoNo: res.id,
				userEmail: account.email,
				userName: account.profile.nickname,
				userCellNo: account.phone_number.replace(/-/gi, '').replace('+82 ', '0').replace('+1 ', ''),
				userInfo: account.birthyear + account.birthday
			
			}

			switch(account.gender) {
				case 'male':
					params.userGender = 'M'
					break;
				case 'female':
					params.userGender = 'W'
					break;
				default:
					params.userGender = 'X'
					break;
			}

			params.userId = params.kakaoNo + '@K';
			params.password = params.kakaoNo + '@K';

			checkKakaoRegistration(params);
			
		},
		fail: function(error) {
			console.log(
				'login success, but failed to request user information: '
				,error
			)
		},
	});
}

// 카카오 연동 여부 조회
function checkKakaoRegistration(params) {
    alert('checkKakaoRegistration')
	console.log("check kakao Registration", params);
	ajaxCall(API_SERVER + '/user/findUserKakao', params, 'POST',
	function(data) {
		console.log("checkKakaoRegistraiton", data);
		var result = data.result;
        alert(result)
		switch(result) {
			case '연동 진행':
				params.userId = result.userId
				linkKakaoUser(params);

				break;
			case '로그인 진행':
				loginKakao(params);
				break;
			case '기존 회원 아님 회원가입 진행':
				// 회원가입 화면으로 연결
				var html = '';
				html += '<form id="registerForm" action="sign-up-form" method="GET">';
				html += '<input type="hidden" name="kakaoNo" value='+ params.kakaoNo +'>';
				html += '<input type="hidden" name="userId" value='+ params.userId +'>';
				html += '<input type="hidden" name="password" value='+ params.password +'>';
				html += '<input type="hidden" name="userEmail" value='+ params.userEmail +'>';
				html += '<input type="hidden" name="userGender" value='+ params.userGender +'>';
				html += '<input type="hidden" name="userCellNo" value='+ params.userCellNo +'>';
				html += '<input type="hidden" name="userInfo" value='+ params.userInfo +'>';
				html += '<input type="hidden" name="userName" value='+ params.userName +'>';
				html += '</form>'

				$('body').append(html);
				$('#registerForm').submit();
				break;
		}
	}, function(err) {
		console.log("error while check kakao registraition", err);
	})
}

// 연동 진행
function linkKakaoUser(params) {
	ajaxCall(API_SERVER + '/user/linkKakaoUser', params, 'POST',
	function(data) {
		console.log("kakao account link success", data);
		if(data.message == 'SUCCESS') {
			loginKakao(params);
		}
	}, function(err) {
		console.log("error while kakao link", err);
	})
}

// 카카오 계정으로 로그인 진행
function loginKakao(params) {
    alert('loginKakao')
	ajaxCall('/user/login/kakao', params, 'POST', 
	function(data) {
        alert('로그인 완료')
		console.log("success loginKakao", data);
		location.reload();
	}, function(err) {
		console.log("error while loginKakao", err);
	});

}

// 카카오 연동 해제
function kakaoUnlink() {
	Kakao.API.request({
		url: '/v1/user/unlink',
		success: function(response) {
		  console.log(response);
		},
		fail: function(error) {
		  console.log(error);
		},
	});
}