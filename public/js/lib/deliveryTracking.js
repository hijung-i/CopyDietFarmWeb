/***************************************
 * 배송 조회 관련 script 모음
 * Author: jgpark
 */

// 스마트 택배 배송 조회 API 설정
var DELIVERY_TRACKING_TOKEN = '5QSKHhEHYIZ9ePFQ8P2SRw';
var DELIVERY_TRACKING_HOST = "https://info.sweettracker.co.kr";

// 운송장 정보 Parsing을 위한 정규식
var COURIER_NO_REGEX = /[^\\uAC00-\\uD7A3xfe0-9a-zA-Z\\\\s]/gi

async function carriersTrackSmart() {
    var params = {
        t_key: DELIVERY_TRACKING_TOKEN
    }

    return await _ajaxCallDeliveryTrack('/api/v1/companylist', params, 'GET')
}

async function parcelTrackSmart(code, invoice) {
    var params = {
        t_key: DELIVERY_TRACKING_TOKEN,
        t_code: code,
        t_invoice: invoice
    }

    return await _ajaxCallDeliveryTrack('/api/v1/trackingInfo', params, 'GET')
}

// 배송 조회용 ajaxCall value 처리 하지 않고 Promise return하는 구조
async function _ajaxCallDeliveryTrack(url, params, type){
    return await $.ajax({
       type : type,
       cache : false,
       data : params,
       url : DELIVERY_TRACKING_HOST + url,
       contentType : "application/json;charset=UTF-8",
       dataType : "json",
       beforeSend : function(xmlHttpRequest){
          xmlHttpRequest.setRequestHeader("AJAX", "true")
          xmlHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*")
       }
    })
}
