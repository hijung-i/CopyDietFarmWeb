// 테스트
// var API_SERVER = "http://112.217.209.162:9090";
var CALLBACK_SERVER = "http://data-flow.co.kr:3000";
var API_SERVER = "http://192.168.0.3:9090";
// var CALLBACK_SERVER = "http://192.168.0.3";

// 운영
// var API_SERVER = "https://dietfarm119.co.kr";
// var CALLBACK_SERVER = "https://dietfarm.co.kr";

var RESOURCE_SERVER = "https://dietfarm119.co.kr/data/diet";


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

function ajaxCallDataTypeHtml(url, params, type, onSuccess, onError, file){
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

         if(file != undefined && file != null && file != false) {
            xmlHttpREqeuset.setRequestHeader
         }
      },
      success : onSuccess,
      error : onError
   })
}

function ajaxCallMultipartFormData(url, params, type, onSuccess, onError){
   $.ajax({
      type : type,
      cache : false,
      data : params,
      url : url,
      enctype: 'multipart/form-data',
      processData: false,
      contentType : false,
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
            console.log(url);
            alert('로그인이 필요한 동작입니다.');
            return false;
         }

         var user = result.user;
         
         if(option.multipart != undefined && option.multipart == true) {
            if(result.isLoggedIn && user != undefined){
               if(isAvailable(option.userId) && option.userId == true) params.append("userId", user.userId)
               if(isAvailable(option.userCellNo) && option.userCellNo == true) params.append("userCellNo", user.userCellNo)
               if(isAvailable(option.userEmail) && option.userEmail == true) params.append('userEmail', user.userEmail)
               if(isAvailable(option.address) && option.address == true) params.append('address', user.address)
            }

            ajaxCallMultipartFormData(url, params, type, onSuccess, onError)
         } else {
            if(result.isLoggedIn && user != undefined){
               if(isAvailable(option.userId) && option.userId == true) params.userId = user.userId
               if(isAvailable(option.userCellNo) && option.userCellNo == true) params.userCellNo = user.userCellNo
               if(isAvailable(option.userEmail) && option.userEmail == true) params.userEmail = user.userEmail
               if(isAvailable(option.address) && option.address == true) params.address = user.address
            }

            ajaxCall(url, params, type, onSuccess, onError);
         }

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
   if(window.history.length < 1) location.href = "/" 
   else window.history.back();
   
   return false;
}

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

   var discountRate = Math.round(product.discountRate, 0)
   if(product.discountPrice != product.retailPrice && discountRate != 0){
      html += '<li class="cost">' + numberFormat(product.retailPrice) + '원</li>';
      html += '<li class="ratio">' + discountRate + '%</li>';
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

// 햄버거 메뉴
$(document).ready(function() {

   $('.btnMenu>a').on('click', function() {
      $('.sideMenu').show().animate({
         left: 0
      });
      var z = $('#tab1').offset().top;
      var innerHeight = $(window).height();
      $('div.sideMenu_ctt').css ({
          'max-height' : (innerHeight - z) + 'px',
          'overflow' : 'auto'
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

});
function niceIdentifyPopup(nextMethod) {
   var options = 'top=10, left=10, width=360, height=600, status=no, menubar=no, toolbar=no, resizable=no';
   open('/nice/identifying-page?nextMethod='+ nextMethod , '다이어트팜 본인 인증', options);
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
   
//메인페이지 index 로그인 모달 js          
//메인화면 진입 시 팝업 창 

$(function(){
   // var popup =
   // '<div id="popup_layer" class="checkLogin">' +
   // '<div class="popup_box">' +
   // //'<span class="close" onclick="closePopupModal();">x</span>' +
   // '<div class="popup_cont">' +
   // '<div class="index-modal">' +
   // '<h2>SNS 1초 회원가입!</h2>' +
   // '<p class="second">1초 간편 회원가입 후,</p>' +
   // '<p><span>10000P + 무료배송</span> 쿠폰 혜택을 받아보세요!</p>' +
   // '<ul class= "login_with_sns">' +
   // '<li class="kakao" onclick="loginWithKakaoApi()"><img src="/images/kakao_login@2x.png"></li>' +
   // '<li class="naver" id="naver_id_login"><img src="/images/naver_login@2x.png"></li>' +
   // '</ul>' +
   // '<a href="/login-form"><p class="id-login">아이디 로그인</p></a>' +
   // '</div>' +
   // '</div>' +
   // '</div>';

   if ($('#naver_id_login').length > 0) {
      ajaxCallDataTypeHtml('/user/naverLoginBtn', {}, 'GET',
      function(data) {
         $('.naver_id_login').html(data);
         $('.modal-content #naver_id_login a').html('<img src="/images/naver_login@2x.png">네이버 계정으로 시작하기');
      }, function (err) {
         console.log("error login button", err);
      })
   }

   AppleID.auth.init({
      clientId : 'kr.co.dietfarm',
      scope : 'name email',
      redirectURI: 'https://dietfarm.co.kr/user/callback/apple',
      state : '12bf1f301be5e2d81aeb514acfa3a03742c20b5e2c424938b7f90f119666445c'
  });
	
});

// kakao 계정 로그인 순서1번
function loginWithKakaoApi() {

   Kakao.Auth.authorize({
      redirectUri: CALLBACK_SERVER + '/user/result/kakao'
      // scope: 'profile,plusfriends,account_email,phone_number,gender,birthday,birthyear'
   })

   
   console.log("loginWithKakaoAPI end");
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

function kakaoLogout() {
   Kakao.Auth.logout(function() {
      location.href = '/logout'
   })
}

function zzimAction(button) {
   var url = '';
   var params = {}
   
   var zzim = $(button).parent();

   var zzimYn = $(zzim).find('input[name=zzimYn]').val();
   var productNo = $(zzim).find('input[name=productNo]').val();
   var productCode = $(zzim).find('input[name=productCode]').val();

   var params = {
      productNo,
      productCode
   }  

   
      url = API_SERVER + '/order/' + ((zzimYn == 'N')?'addZzim':'deleteZzim');

   ajaxCallWithLogin(url, params, 'POST',
   function(data) {
      console.log('zzimaction', params, data);
      if(zzimYn == 'N') {
         $(zzim).find('input[name=zzimYn]').val('Y');
         $(zzim).find('div.like').removeClass('like-no');
         $(zzim).find('div.like').addClass('like-yes');
      } else if(zzimYn == 'Y') {
         $(zzim).find('input[name=zzimYn]').val('N');
         $(zzim).find('div.like').removeClass('like-yes');
         $(zzim).find('div.like').addClass('like-no');
      }
   

   }, function(err) {
      console.error(err)
   }, {
      isRequired: true,
      userId: true
   })
}

//URL 공유하기 코드
$(document).on("click", "#sh-link", function(e) { 
 $('html').find('meta[name=viewport]').attr('content', 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'); var html = "<input id='clip_target' type='text' value='' style='position:absolute;top:-9999em;'/>"; $(this).append(html); 
 var input_clip = document.getElementById("clip_target"); 
 var _url = $(location).attr('href'); $("#clip_target").val(_url); if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) { var editable = input_clip.contentEditable; var readOnly = input_clip.readOnly; input_clip.contentEditable = true; input_clip.readOnly = false; var range = document.createRange(); range.selectNodeContents(input_clip); var selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); input_clip.setSelectionRange(0, 999999); input_clip.contentEditable = editable; input_clip.readOnly = readOnly; } 
 else { input_clip.select(); } try { var successful = document.execCommand('copy'); input_clip.blur(); if (successful) { alert("URL이 복사 되었습니다. 원하시는 곳에 붙여넣기 해 주세요.");
  $('html').find('meta[name=viewport]').attr('content', 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes'); } else { alert('이 브라우저는 지원하지 않습니다.'); } } 
  catch (err) { alert('이 브라우저는 지원하지 않습니다.'); } });


function scrollBlock() {
   $('html, body').css({'overflow': 'hidden', 'height': 'auto'});
   $('html,body').on('scroll touchmove mousewheel', function(event) {
         event.preventDefault();
         event.stopPropagation();
         return false;
   });
}

function scrollAllow() {
   $('html, body').css({'overflow': 'visible'});
   $('html,body').off('scroll touchmove mousewheel');
}

function clip(){

	var url = '';
	var textarea = document.createElement("textarea");
	document.body.appendChild(textarea);
	url = window.document.location.href;
	textarea.value = url;
	textarea.select();
	document.execCommand("copy");
	document.body.removeChild(textarea);
	alert("URL이 복사되었습니다.")
}