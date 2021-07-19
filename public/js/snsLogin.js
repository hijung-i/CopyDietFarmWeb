
// 카카오계정 로그인 이후 유저 정보 요청
function requestKaKaoUserInfo() {
	Kakao.API.request({
		url: '/v2/user/me',
		success: function(res) {
			console.log(res)
			var account = res.kakao_account;
			
			if (account.birthday_needs_agreement == true ) {
				account.birthyear = '0000';
			}
			if (account.birthyear_needs_agreement == true ) {
				account.birthday = '0000';
			}
			if (account.gender_needs_agreement == true ) {
				account.gender = 'X';
			}

			if (account.has_phone_number == false) {
				alert('핸드폰 번호는 필수 정보입니다.')
				kakaoUnlink();
				return;
			}

			var params = {
				type: 'K',
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
				, error
			)
			alert('카카오 로그인 중 오류가 발생했습니다.');
			location.href = "/";
			return;
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
				
				$('input[name=type]').val(params.type)
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
			case '탈퇴회원':
				alert('탈퇴 후 30일이 지나지 않아 재가입이 불가능합니다.')
				kakaoUnlink();
				break;
		}
	}, function(err) {
		alert("에러가 발생했습니다.", JSON.stringify(err));
		console.log("error while check kakao registraition", err);
	})
}
// 네이버 연동 여부 확인
function checkNaverRegistration(params) {
	console.log("check naver Registration", params);
	ajaxCall(API_SERVER + '/user/findNaverUser', params, 'POST',
	function(data) {
		console.log("check naverRegistraiton", data);
		var result = data.result;
		// 이미 가입
		var next = ''
		if(result != null && result != undefined) {
			if(result.tokenNaver != '' && result.tokenNaver != undefined) {
				next = '로그인 진행'
			} else {
				next = '연동 진행'
			}
		} else {
			next = '기존 회원 아님 회원가입 진행'
		}

        console.log(result, next)
		switch(next) {
			case '연동 진행':
				params.userId = result.userId
				linkNaverUser(params);
				break;
			case '로그인 진행':
				loginNaver(params);
				break;
			case '기존 회원 아님 회원가입 진행':
				// 회원가입 화면으로 연결
				$('input[name=type]').val(params.type)
                $('input[name=tokenNaver]').val(params.tokenNaver)
				$('input[name=userId]').val(params.userId)
				$('input[name=password]').val(params.password)
				$('input[name=userEmail]').val(params.userEmail)
				$('input[name=userGender]').val(params.userGender)
				$('input[name=userCellNo]').val(params.userCellNo)
				$('input[name=userInfo]').val(params.userInfo)
				$('input[name=userName]').val(params.userName)

				$('#registerForm').submit();
				break;
			case '탈퇴회원':
				alert('탈퇴 후 30일이 지나지 않아 재가입이 불가능합니다.')
				kakaoUnlink();
				break;
		}
	}, function(err) {
		if(err.responseText == 'NOT_FOUND') {
			$('input[name=tokenNaver]').val(params.tokenNaver)
			$('input[name=userId]').val(params.userId)
			$('input[name=password]').val(params.password)
			$('input[name=userEmail]').val(params.userEmail)
			$('input[name=userGender]').val(params.userGender)
			$('input[name=userCellNo]').val(params.userCellNo)
			$('input[name=userInfo]').val(params.userInfo)
			$('input[name=userName]').val(params.userName)

			$('#registerForm').submit();
		} else {
			console.log("error while check naver registraition", err);
			alert("에러가 발생했습니다.", JSON.stringify(err));
			location.href = "/"
		}
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
		alert("계정 연동 중 에러가 발생했습니다.", JSON.stringify(err));
		location.href = "/"
	})
}

function linkNaverUser(params) {
	ajaxCall(API_SERVER + '/user/linkNaverUser', params, 'POST',
	function(data) {
		console.log("naver account link success", data);
		if(data.message == 'SUCCESS') {
			loginNaver(params);
		}
	}, function(err) {
		console.log("error while naver link", err);
		alert("계정 연동 중 에러가 발생했습니다.", JSON.stringify(err));
		location.href = "/"
	})
}

function linkAppleUser(params) {
	ajaxCall(API_SERVER + '/user/linkAppleUser', params, 'POST',
	function(data) {
		console.log("apple account link success", data);
		if(data.message == 'SUCCESS') {
			loginApple(params);
		}
	}, function(err) {
		console.log("error while apple link", err);
		alert("계정 연동 중 에러가 발생했습니다.", JSON.stringify(err));
		location.href = "/"
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
		alert("에러가 발생했습니다.");
		location.href="/";
	});

}

// 네이버 계정으로 로그인 진행
function loginNaver(params) {
	ajaxCall('/user/login/naver', params, 'POST', 
	function(data) {
		console.log("success loginNaver", data);
		location.href='/';
	}, function(err) {
		console.log("error while loginNaver", err);
		alert("에러가 발생했습니다.", JSON.stringify(err));
		location.href="/";
	});

}

function loginApple(params) {
	ajaxCall('/user/login/apple', params, 'POST',
	function(data) {
		console.log("success loginApple", data);
		location.href = "/"
	}, function(err) {
		console.log("애플 로그인 중 오류가 발생했습니다", err)
		alert("애플 로그인 중 오류가 발생했습니다", JSON.stringify(err))
		return;
		location.href = "/"
	})
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

function checkAppleLoginValue() {
	
	var appleNo = $('input[name=appleNo]').val()
	var userId = $('input[name=userId]').val()
	var userEmail = $('input[name=userEmail]').val();

	if(userEmail == '' || userEmail == undefined ) { 
		alert('이메일 정보가 필요합니다.');
		return;
	}
	
	var params = {
		type: 'A',
		userId,
		appleNo,
		userEmail
	}

	ajaxCall(API_SERVER + '/user/findAppleUser', params, 'POST', 
	function ( data ) {
		console.log(data);
		if (data === 'DUPLICATE') {
			// 탈퇴 회원
			alert('탈퇴 후 30일이 지나지 않아 재가입이 불가능합니다.')
			location.href = "/"
			return;
		} else if (data === 'NOT_FOUND') {
			// 가입 진행
			$('#registerForm').submit();
			
		} else if (data.result != undefined ) {
			if (data.result.appleNo != '' && data.result.appleNo != undefined ) {
				// 로그인
				loginApple(params);
			} else if (data.result.userId != '' && data.result.appleNo === ''){
				// 계정 연동
				linkAppleUser(params);
			}
		}
	}, function ( err ) {
		if(err.responseText == 'NOT_FOUND') {
			$('#registerForm').submit();
		} else {
			console.log("error while check apple registraition", err);
			alert("에러가 발생했습니다.", JSON.stringify(err));
			location.href = "/"
		}
	})
}

function checkNaverLoginValue() {
	var tokenNaver = $('input[name=tokenNaver]').val();
	if(tokenNaver == '' || tokenNaver == undefined) {
		alert('잘못된 접근입니다.');
		location.href="/";
		return
	}

	var userCellNo = $('input[name=userCellNo]').val();
	if(userCellNo == '' || userCellNo == undefined) {
		alert('핸드폰 번호는 필수 정보입니다.');
		location.href="/";
		return
	}

	var userId = $('input[name=userId]').val();
	if(userId == '' || userId == undefined) {
		alert('잘못된 접근입니다.');
		location.href="/";
		return
	}

	var userName = $('input[name=userName]').val();
	if(userName == '' || userName == undefined) {
		alert('잘못된 접근입니다.');
		location.href="/";
		return
	}

	var password = $('input[name=password]').val();
	if(password == '' || password == undefined) {
		alert('잘못된 접근입니다.');
		location.href="/";
		return
	}

	var userGender = $('input[name=userGender]').val();
	var userEmail = $('input[name=userEmail]').val();
	var userInfo = $('input[name=userInfo]').val();
	if(userInfo == '' || userInfo == undefined) {
		userInfo = ''
	}

	var params = {
		type: 'N',
		tokenNaver,
		userId,
		userName,
		password,
		userCellNo,
		userGender,
		userInfo,
		userEmail
	}

	checkNaverRegistration(params)
}