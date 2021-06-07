var app = new Vue({
    el: 'main',
    data: {
        noticeList: []
    }
})

function getNotice() {
    var params = {};
    ajaxCall(API_SERVER + '/board/getAllNotice', params, 'POST'
    , function(data) {
        app.noticeList = data.result
        console.log(data.result);
    }, function(err) {
        console.log("error while getAllNotice");
    })    
}

$(function() {
    getNotice();
})