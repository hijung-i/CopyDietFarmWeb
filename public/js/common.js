//var API_SERVER = "http://localhost:9090";
//var API_SERVER = "http://192.168.0.3:9090";
//var API_SERVER = "http://112.217.209.162:9090";
//var RESOURCE_SERVER = "http://112.217.209.162:8000";
 var API_SERVER = "http://13.209.123.102:9090";

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
			if(option.isRequired == true && data.isLoggedIn != true) {		
				// TODO: Open alert modal
				return false;
			}
			
			var user = data.user;
			if(data.isLoggedIn && user != undefined){
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

function getEventStands() {
	var currentStandCode = $('#currentStandCode').val();
    var param = {}
    ajaxCall(API_SERVER + "/product/getEventStands", param, 'post'
    , function(data) {

		$("#header .gnb").html('');
		var html = '';
		
		console.log(data);
		for(var i = 0; i < data.result.length; i++){
			var stand = data.result[i];
			if(i == 0){
				html += '<a href="/" '+ ((currentStandCode == stand.salesStandCode)?'class="is-current"':'')+'>홈</a>';
			}
			console.log(currentStandCode, stand.salesStandCode);
			if( currentStandCode == stand.salesStandCode){
				$('#header .gnb a').removeClass("is-current");
				html += '<a href="/products/'+ stand.salesStandCode + '/event" class="is-current">'+ stand.salesStandName +'</a>';
			} else {
				html += '<a href="/products/'+ stand.salesStandCode + '/event" >'+ stand.salesStandName +'</a>';
			}
		}

		html += '<div class="nav-underline"></div>';
		console.log(html);
		$('#header .gnb').html(html);
				
    }, function(err) {
        console.log("eventStands err", err);
    })
}

function numberFormat(number) {
	return (number+"").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateHtmlForProductList(products){
    var html = '';
    for(var j = 0; j < products.length; j++){
        var product = products[j];
        html += generateHtmlForProduct(product);
    }
    return html;
}1

function generateHtmlForProduct(product){
	
    var html = '<li>';
	html += '<a href="/product/'+ product.productCode +'">';
	html += '<div class="thum"><img src="' +RESOURCE_SERVER + product.url + '" alt="' +product.productName + '썸네일">';
	html += '<div class="ico_zzim">';
	html += '<div class="btn_zzim_sty">';
	html += '<a href="#">';
	html += '<span class="blind"></span>';
	html += '</a>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
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
	html += '<a>';
	html += '</li>';
    return html;
}

function goBack() {
	window.history.back();
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
 // �덉씠�� �앹뾽
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
		$(".pop_layer_back").css("height",allHeight).show(); //�ㅽ겕濡ㅻ븣臾몄뿉 �꾩껜 height媛믪쓣 援ы빐 諛곌꼍�� 吏곸젒height媛� �곸슜
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
	$("dt.faq_q").click(function() {
		if ($(this).next('dd').css("display") != "none") {
			$(this).next('dd').hide();
			$(this).removeClass("current");
		} else {
			$("dd.faq_a").css('display', 'none');
			$("dt.faq_q").removeClass("current");
			$(this).next('dd').show();
			$(this).addClass("current");
		}
	});
});

 $(document).ready(function() {

	$('.btnMenu>a').on('click', function() {
		$('.gnb').hide();
	});

	$('.slideMenu_close>a').on('click', function() {
		$('.gnb').show();
	});

	$("#gnbAllMenu").hide();
	$("#btnGnbOpen").click(function(){
		$("#gnbAllMenu").slideToggle("");
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
function niceIdentifyPopup() {
	var options = 'top=10, left=10, width=360, height=600, status=no, menubar=no, toolbar=no, resizable=no';
	open('/nice/identifying-page?nextMethod=register', '다이어트팜 본인 인증', options);
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


