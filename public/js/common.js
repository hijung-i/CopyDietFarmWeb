// var API_SERVER = "http://localhost:9090";
// var SERVER_IP = '192.168.0.3';
// var SERVER_IP = 'data-flow.co.kr';
var SERVER_IP = 'dietfarm.co.kr';

// var CALLBACK_SERVER = "http://"+ SERVER_IP +":3000";
var CALLBACK_SERVER = "http://"+ SERVER_IP;
var API_SERVER = "http://"+ SERVER_IP +":9090";

// var API_SERVER = "http://112.217.209.162:9090";
var RESOURCE_SERVER = "http://112.217.209.162:8000";
// var API_SERVER = "http://13.209.123.102:9090";

var RESOURCE_SERVER = "http://13.209.123.102:8000";


function ajaxCall(url, params, type, onSuccess, onError){
	var param = JSON.stringify(params);

	$.ajax({
		type : type,
		cache : false,
		data : param,
		url : url,
		contentType : "application/json;charset=UTF-8",
		dataType : "json",
		beforeSend : function(xmlHttpRequest){
			xmlHttpRequest.setRequestHeader("AJAX", "true")
			xmlHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*")
		},
		success : onSuccess,
		error : onError
	})
}

function ajaxCallDataTypeHtml(url, params, type, onSuccess, onError){
	var param = JSON.stringify(params);
	$.ajax({
		type : type,
		cache : false,
		data : param,
		url : url,
		contentType : "application/json;charset=UTF-8",
		beforeSend : function(xmlHttpRequest){
			xmlHttpRequest.setRequestHeader("AJAX", "true")
			xmlHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*")
		},
		success : onSuccess,
		error : onError
	})
}

// option -> require user data as parameter
function ajaxCallWithLogin(url, params, type, onSuccess, onError, option){
	$.ajax({
		type: 'GET',
		cache: false,
		url: '/user/login',
		dataType: "json",
		success: function(data) {
			var result = data.result;
			if(option.isRequired == true && result.isLoggedIn != true) {
				// TODO: Open alert modal
				alert('로그인이 필요한 동작입니다.');
				return false;
			}

			var user = result.user;
			if(result.isLoggedIn && user != undefined){
				if(isAvailable(option.userId) && option.userId == true) params.userId = user.userId
				if(isAvailable(option.userCellNo) && option.userCellNo == true) params.userCellNo = user.userCellNo
				if(isAvailable(option.userEmail) && option.userEmail == true) params.userEmail = user.userEmail
				if(isAvailable(option.address) && option.address == true) params.address = user.address
			}
			ajaxCall(url, params, type, onSuccess, onError);

		},
		error: function(err){
			console.log("err", err);
		}
	})
}

function isAvailable(data){
	return (data != null && data != undefined && data != '')
}

function numberFormat(number) {
	return (number+"").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateHtmlForProductList(products, maxSize){
    var html = '';
    for(var j = 0; j < products.length; j++){
        if(maxSize != undefined && j > maxSize -1) break;
		var product = products[j];
        html += generateHtmlForProduct(product);
		
    }
    return html;
}

function goBack() {
	window.history.back(); return false;
}
// 뒤로가기 ios 대응
// 
//  html 
//  function Inti() {
//  	window.location.reload();
//  }
// 
// //javascript
// window.onpageshow = function(event) { //BFCache
// 	if (event.persisted) {
// 		window.location.reload();
// 	} else{} //새로운페이지
// }
// 
// //jquery
// $(window).bind("pageshow", function(event) {
// 	if (event.originalEvent && event.originalEvent.persisted) {// BFCache
// 		window.location.reload();
// 	}else{}//새로운페이지
// });

function generateHtmlForProduct(product){

    var html = '<li>';
	html += '<div class="thum">';
	html += '<a href="/product/'+ product.productCode +'">';
	html += '<img src="' +RESOURCE_SERVER + product.url + '" alt="' +product.productName + '썸네일">';
	html += '</a>';
	html += '<input type="hidden" name="productNo" value="'+ product.productNo +'">';
	html += '<input type="hidden" name="productCode" value="'+ product.productCode +'">';
	html += '<input type="hidden" name="zzimYn" value="'+ product.zzimYn +'">';

	if(product.zzimYn == 'Y') {
		html += '<div class="like like-yes" onclick="zzimAction(this)"></div>';
	}
	else if(product.zzimYn == 'N') {
		html += '<div class="like like-no" onclick="zzimAction(this)"></div>';
	}
	html += '</div>';
	html += '<a href="/product/'+ product.productCode +'">';
	html += '<div class="desc">';
	html += '<p class="title">' +product.productName + '</p>';
	html += '<ul>';
	html += '<li class="sale">' + numberFormat(product.discountPrice) + '원</li>';
	if(product.discountPrice != product.retailPrice){
		html += '<li class="cost">' + numberFormat(product.retailPrice) + '원</li>';
		html += '<li class="ratio">' + Math.round(product.discountRate, 0) + '%</li>';
	}
	html += '</ul>';
	html += '</div>';
	html += '</a>';
	html += '</li>';
    return html;
}

$(window).bind('orientationchange', function(e) {
	if(jQuery('#sideMenu').css("left")=="0px"){

		var clientHeight = parseInt(screen.height);
		setTimeout(scrollTo, 0, 0, 1);
		jQuery('#sideMenu').show();
		jQuery('#sideMenu').css({"left":"0", "height":clientHeight + 'px'});
		jQuery('html, body, #wrapper').css({
			'overflow-y':'hidden',
			'height': '100%'
        });
		jQuery('.side_back').height(clientHeight + 'px');
		return false
	}
});

function mSearch(key) {
	if(key=="on") {
		sideMenu('off');

		var clientHeight = parseInt(screen.height);
		setTimeout(scrollTo, 0, 0, 1);
		jQuery('#m_search').show();
		jQuery('html, body, #wrapper').css({
			'overflow-y':'hidden',
			'height': '100%'
        });
		jQuery('.search_back').height(clientHeight + 'px').fadeIn();

		return false
	} else {
		jQuery('#m_search .keyword').val('');
		jQuery('#m_search').hide();
		jQuery('body, #wrapper').css({
			'height': 'auto'
        });
		jQuery('html').css({
			'overflow-y':'scroll',
			'height': 'auto'
        });
		jQuery('.search_back').fadeOut();
		return false
	}
}

function sideMenu(key) {
	if(key=="on") {
		jQuery('#m_search').hide();
		jQuery('.mDepth01>li>dl>dd').css('display','none');
		jQuery('.mDepth01>li>dl>dt').removeClass("on");
		$(".mDepth01>li.current").each(function() {
			$(this).addClass("on");
			$(this).children('dl').children('dt').addClass("on");
			$(this).children('dl').children('dd').show();
		});

		var clientHeight = parseInt(screen.height);
		setTimeout(scrollTo, 0, 0, 1);
		jQuery('#sideMenu').show();
		jQuery('#sideMenu').css({"left":"0", "height":clientHeight + 'px'});
		jQuery('html, body, #wrapper').css({
			'overflow-y':'hidden',
			'height': '100%'
        });
		jQuery('.side_back').height(clientHeight + 'px').fadeIn();

		return false
	} else {
		jQuery('#sideMenu').css("left","-87%");
		jQuery('body, #wrapper').css({
			'height': 'auto'
        });
		jQuery('html').css({
			'overflow-y':'scroll',
			'height': 'auto'
        });
		jQuery('.side_back').fadeOut();
		return false
	}
}

function onLayerPop(layerId, seq, lang) {

	if (layerId == 'offLayer'){
		$(".pop_layer").hide();
	} else {
		var h = $("#"+layerId).height();
		if(document.body.scrollHeight <= document.body.Height){
			var allHeight = document.body.Height;
		} else {
			var allHeight = document.body.scrollHeight;
		}
	}
}

function onLayerPop02(layerId, seq) {
	//alert(layerId);
	if (layerId == 'offLayer'){
		$(".pop_layer").hide();
	} else {
		var h = $("#"+layerId).height();
	//	$(".pop_layer_back").hide();
		if(document.body.scrollHeight <= document.body.Height){
			var allHeight = document.body.Height;
		} else {
			var allHeight = document.body.scrollHeight;
		}

		$(".pop_layer").hide();
		$(".pop_layer_back").css("height",allHeight).show();
		$("#"+layerId).show();
		$("#"+layerId+">.popContainer").show();

	}
}

function showLayer( obj ) {
	$('#' + obj).slideToggle("fast", function () {
		if($(this).css("display") == 'block') {
			$("img#arDown").attr("src","/mobile/img/arrow_up.png");
		}
		else {
			$("img#arDown").attr("src","/mobile/img/arrow_down.png");
		}
	});
}

function changeMyTab(opt) {
	$('#myTab1').hide();
	$('#myTab2').hide();
	$('#myTab3').hide();
	$('#myTab4').hide();
	$('#myTab5').hide();
	$('#myTab6').hide();
	$('#myTab7').hide();
	$('#myTab8').hide();
	$('#myTab' + opt).show();
}

// 햄버거 메뉴
$(document).ready(function() {

	$('.btnMenu>a').on('click', function() {
		$('.sideMenu').show().animate({
			left: 0
		});
	});
	$('.slideMenu_close>a').on('click', function() {
		$('.sideMenu').animate({
			left: -100 + '%'
		}, function() {
			$('.sideMenu').hide();
		});
	});
});


// 햄버거 2단계 메뉴

 $(document).ready(function() {

	$('.btnMenu>a').on('click', function() {
		$('.gnb').hide();
	});

	$('.slideMenu_close>a').on('click', function() {
		$('.gnb').show();
	});

	$("#memberMenu").bind("moseover mouseenter",function(){
		$("#memMenu").show();
	});

	$("#memMenu").bind("moseout mouseleave",function(){
		$("#memMenu").hide();
	});

	$("#NotmemberMenu").bind("moseover mouseenter",function(){
		$("#NotmemMenu").show();
	});

	$("#NotmemMenu").bind("moseout mouseleave",function(){
		$("#NotmemMenu").hide();
	});

});
function niceIdentifyPopup(nextMethod) {
	var options = 'top=10, left=10, width=360, height=600, status=no, menubar=no, toolbar=no, resizable=no';
	open('/nice/identifying-page?nextMethod='+ nextMethod , '다이어트팜 본인 인증', options);
}

function onIdentifyingSuccess(data, nextMethod) {
	console.log(data);
	$("#formUserName").val(data.userName);
	$("#formUserInfo").val(data.userInfo);
	$("#formDupInfo").val(data.dupInfo);
	$("#formUserGender").val(data.userGender);
	$("#formUserCellNo").val(data.userCellNo);
	switch(nextMethod) {
		case 'register':
			$("#infoForm").attr("action", "/sign-up-form");
			break;
	}

	$("#infoForm").submit();

}

// 쿠키 생성
function setCookie(cName, cValue, cDay){
	var expire = new Date();
	expire.setDate(expire.getDate() + cDay);
	cookies = cName + '=' + escape(cValue) + '; path=/ ';
	if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
	document.cookie = cookies;
}

// 쿠키 가져오기
function getCookie(cName) {
	cName = cName + '=';
	var cookieData = document.cookie;
	var start = cookieData.indexOf(cName);
	var cValue = '';
	if(start != -1){
		 start += cName.length;
		 var end = cookieData.indexOf(';', start);
		 if(end == -1)end = cookieData.length;
		 cValue = cookieData.substring(start, end);
	}
	return unescape(cValue);
}

  
//마이페이지 로그인 모달 js
$(function(){
	//$(".popup_box").draggable({containment:'parent', scroll:false}); // 레이어 팝업 창 드래그 가능
	//{containment:'parent', scroll:false} 화면 영역 밖으로 드래그 안됌.
    var modal = document.getElementById('myModal');

	if ($('#naver_id_login').length > 0) {
		ajaxCallDataTypeHtml('/user/naverLoginBtn', {}, 'GET',
		 function(data) {
			$('#naver_id_login').html(data);
		}, function (err) {
			console.log("error login button", err);
		})
	}

	
	
});
var modals = document.getElementsByClassName("modal");
// Modal을 띄우는 클래스 이름을 가져옵니다.
var btns = document.getElementsByClassName("btn");
// Modal을 닫는 close 클래스를 가져옵니다.
var spanes = document.getElementsByClassName("close");
var funcs = [];
 
// Modal을 띄우고 닫는 클릭 이벤트를 정의한 함수
function Modal(num) {
  // 해당 클래스의 내용을 클릭하면 Modal을 띄웁니다.
    btns[num].onclick =  function() {
        modals[num].style.display = "block";
        console.log(num);
    };
 
    // <span> 태그(X 버튼)를 클릭하면 Modal이 닫습니다.
    spanes[num].onclick = function() {
        modals[num].style.display = "none";
    };
  };

// 원하는 Modal 수만큼 Modal 함수를 호출해서 funcs 함수에 정의합니다.
for(var i = 0; i < btns.length; i++) {
  funcs[i] = Modal;
}
 
// 원하는 Modal 수만큼 funcs 함수를 호출합니다.
for(var j = 0; j < btns.length; j++) {
  funcs[j](j);
}
 
// Modal 영역 밖을 클릭하면 Modal을 닫습니다.
window.onclick = function(event) {
  if (event.target.className == "modal") {
      event.target.style.display = "none";
  }
};
	
//메인페이지 index 로그인 모달 js			 
//오늘하루만보기 닫기버튼 스크립트
function closeToday() {
	setCookie( "popToday", "close" , 1  );
	$("#popup_layer").css("display", "none");
	document.getElementById("popup_layer").style.display = "none";
}
//그냥 닫기버튼 스크립트
function closePop() {
	document.getElementById("popup_layer").style.display = "none";
}


// 7일동안 닫기버튼 스크립트는 아래 스크립트로 교체
function closeToday() {
	setCookie( "popToday", "close" , 7 );
	$("#popup_layer" ).css("display", "none");
	document.getElementById("popup_layer").style.display = "none";
}
function closePop() {
	document.getElementById("popup_layer").style.display = "none";
}    

//메인화면 진입 시 팝업 창 

$(function(){
	var popup = 
	'<div class="popup_box">' +
	'<div class="popup_cont">' +
	'<div class="index-modal">' +
	'<h2>SNS 1초 회원가입!</h2>' +
	'<p class="second">1초 간편 회원가입 후,</p>' +
	'<p><span>5000P + 무료배송</span> 쿠폰 혜택을 받아보세요!</p>' +
	'<ul>' +
	'<li class="kakao" onclick="loginWithKakaoApi()"><img src="/images/kakao_login@2x.png"></li>' +
	'<li class="naver" id="naver_id_login"><img src="/images/naver_login@2x.png"></li>' +
	'</ul>' +
	'<a href="/login-form"><p class="id-login">아이디 로그인</p></a>' +
	'</div>' +
	'</div>'+
	'<div class="popup_btn">' +
	'<a id="chk_today" href="javascript:closeToday();" class="close_day">오늘 하루 보지 않기</a> ' +
	'<a href="javascript:closePop();">닫기</a>' +
	'</div>' +
	'</div>';

	var myPageModal = 
	'<div class="modal-content">' +
	'<span class="close" onclick="closeModal()">&times;</span>' +
	'<div class="login-list">' + 
	'<ul>' +
	'<li><button id="naver_id_login" class="naver">네이버로 로그인</button></li>' +
	'<li><button onclick="loginWithKakaoApi()" class="kakao">카카오로 로그인/가입</button></li>' +
	'<li><a href="/login-form" class="id_comp">아이디로 로그인</a></li>' +
	'</ul>' +
	'</div>' +
	'</div>' ;

			
	var inquiryModal = 
	'<div class="modal-content">' +
	'<span class="close">&times;</span>' +
	'<div class="productInquiryBox">' +
	'<h3>(아임월) 굿밸런스 라이트밀 도시락</h3>' +
	'<form>' +
	'<p><textarea style="border-radius:5px;width:100%;height:153px" placeholder="문의하실 내용을 입력해주세요"></textarea></p>' +
	'</form>' +
	'<div class="group">' +
	'<input type="checkbox" id="secret">' +
	'<label for="secret" class="secret">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;비밀글 선택시 작성자만 조회 가능합니다.</label>' +
	'</div>' +
	'</div>' +
	'<div class="btn_area">' +
	'<button type="button" id="btnInquiry">등록</button>' +
	'</div>' +
	'</div>';
	
	ajaxCall('/user/login', '', 'GET',
	function(data) {
		// 로그인 시에만 표시
		console.log(data);
		if(data.result.isLoggedIn == false) {
			$("#popup_layer").html(popup);
			$("#myModal").html(myPageModal);
		} else {
			$('#popup_layer').hide();
		}

		var modal = document.getElementById('myModal');
		var btn = document.getElementById('myBtn');
		var span = document.getElementsByClassName('close')[0];
		var funcs = [];
		// if(btn != null) {
		// 	btn.addEventListener('click', openModal());
		// }

		// if( span != null) {
		// 	span.addEventListener('click', hideModal());
		// }

		// // When the user clicks on the button, open the modal 
		// btn.onclick = function() {
		// modal.style.display = "block";
		// }

		// // When the user clicks on <span> (x), close the modal
		// span.onclick = function() {
		// modal.style.display = "none";
		// }

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		}
	}, function(err){
		console.error(err);
	})
	$("#modal-inquiry").html(inquiryModal);
	
});

// kakao 계정 로그인 순서1번
function loginWithKakaoApi() {
	Kakao.Auth.authorize({
        redirectUri: CALLBACK_SERVER + '/user/result/kakao',
		scope: 'profile,plusfriends,account_email,gender,birthday,birthyear,phone_number'
	})
}

function naverCallback(success, paramStr) {
	if(success) {
		var params = JSON.parse(paramStr);
		
		location.href = '/user/result/naver?tokenNaver='+params.tokenNaver+'&userId='+params.userId+'&userCellNo='+params.userCellNo
		+ '&userInfo='+params.userInfo+'&userEmail='+params.userEmail+'&userName='+params.userName+'&password='+params.password+'&userGender='+params.userGender
	} else  {
		alert('네이버 아이디로 로그인에 실패했습니다.')
		location.href = '/'
	}
}

function zzimAction(button) {
	var url = '';
	var params = {}
	
	var zzim = $(button).parent();

	var zzimYn = $(zzim).find('input[name=zzimYn]').val();
	var productNo = $(zzim).find('input[name=productNo]').val();
	var productCode = $(zzim).find('input[name=productCode]').val();

	console.log(zzimYn);
	var params = {
		productNo,
		productCode
	}
	
	if(zzimYn == 'N') {
		url = API_SERVER + '/order/addZzim';
		$(zzim).find('input[name=zzimYn]').val('Y');
		$(zzim).find('div.like').removeClass('like-no');
		$(zzim).find('div.like').addClass('like-yes');
	} else if(zzimYn == 'Y') {
		url = API_SERVER + '/order/deleteZzim';
		$(zzim).find('input[name=zzimYn]').val('N');
		$(zzim).find('div.like').removeClass('like-yes');
		$(zzim).find('div.like').addClass('like-no');
	}
	console.log(url);

	ajaxCallWithLogin(url, params, 'POST',
	function(data) {
		console.log('zzimaction', params, data);
	}, function(err) {
		console.error(err)
	}, {
		isRequired: true,
		userId: true
	})
}
