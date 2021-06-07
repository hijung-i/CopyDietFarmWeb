var app = new Vue({
    el: 'main',
    data: {
        notice: {}
    }
})

function getSpecificBoard() {
    var boardNo = $("#boardNo").val();
    var params = {
        boardNo: boardNo
    }

    ajaxCall(API_SERVER + '/board/getSpecificBoard', params, 'POST'
    , function(data) {
        console.log(data);
        if(data.result.length == 0){
            alert('글을 찾을 수 없습니다.');
            location.href="/notice";
        }
        app.notice = data.result[0]; 
    }, function(err) {
        console.log(err);
    })
}

$(function() {
    getSpecificBoard();
});