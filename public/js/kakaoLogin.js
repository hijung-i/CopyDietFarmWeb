// function loginWithKakaoApi() {
// 	Kakao.Auth.login({
// 		success: function(authObj) {
// 			console.log("success", authObj)
// 			if(authObj != undefined) {
// 				alert('로그인')
// 				requestKaKaoUserInfo();
// 			} else {
// 				alert('실패', err);
// 				alert('KAKAO 계정으로 로그인에 실패했습니다.');
// 			}
// 		},
// 		fail: function(err) {
// 			console.log("err", err);
// 			alert('로그인 실패', err)
// 			if(err) {
// 				alert('KAKAO 계정으로 로그인에 실패했습니다.');
// 				return;
// 			}
// 		},
// 	})
// }

// 카카오계정 로그인 이후 유저 정보 요청
function requestKaKaoUserInfo() {
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

			if (account.has_phone_number == false) {
				alert('핸드폰 번호는 필수 정보입니다.')
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
                $('input[name=kakaoNo]').val(params.kakaoNo)
				$('input[name=userId]').val(params.userId)
				$('input[name=password]').val(params.password)
				$('input[name=userEmail]').val(params.userEmail)
				$('input[name=userGender]').val(params.userGender)
				$('input[name=userCellNo]').val(params.userCellNo)
				$('input[name=userInfo]').val(params.userInfo)
				$('input[name=userName]').val(params.userName)

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
	ajaxCall('/user/login/kakao', params, 'POST', 
	function(data) {
		console.log("success loginKakao", data);
		location.href='/';
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
			location.href = '/logout'
		},
		fail: function(error) {
		  console.log(error);
		},
	});
}

$(function() {
	if($('#type').val() == 'K') {
		var token = $('input[name=tokenKakao]').val()
		console.log(token)
		Kakao.Auth.setAccessToken(token)
		requestKaKaoUserInfo();
	}
})