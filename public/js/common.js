var API_SERVER = "http://192.168.0.3:9090";
// var API_SERVER = "http://112.217.209.162:9090";
var RESOURCE_SERVER = "http://112.217.209.162:8000";

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
		var html = "";
		html += '<li class="gnb01"><a href="/">홈</a></li>';
		for(var i = 0; i < data.result.length; i++){
			var stand = data.result[i];
			if( currentStandCode == stand.salesStandCode){
				html += '<li class="gnb0'+(i + 2)+' active"><a href="/products/'+stand.salesStandCode+'/event">'+ stand.salesStandName+'</a></li>';
			} else {
				html += '<li class="gnb0'+(i + 2)+'"><a href="/products/'+stand.salesStandCode+'/event">'+ stand.salesStandName+'</a></li>';
			}
			
		}
		$('.main_gnb').html(html);

		
    }, function(err) {
        console.log("eventStands err", err);
    })
}

function numberFormat(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    var html = '';
    html += '<li>';
    html += '<a href="/product/'+ product.productCode+'">';
    html += '<div class="thum"><img src="'+RESOURCE_SERVER + product.url + '" alt="썸네일 이미지">';
    html += '</div>';
    html += '<div class="desc">';
    html += '<p class="title">'+ product.productName +'</p>';
    html += '<p class="price">'+ numberFormat(product.discountPrice) +'원</p>';
    html += '</div>';
    html += '</a>';
    html += '</li>';
    return html;
}

function goBack() {
	window.history.back();
}

$(function() {
	getEventStands();
})