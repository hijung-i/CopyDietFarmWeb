function getSpecificBoard() {
    var boardNo = $("#currentBoardNo").val();
    var params = {
        boardNo: boardNo
    }

    ajaxCall(API_SERVER + '/board/getSpecificBoard', params, 'POST'
    , function(data) {
        var notice = data.result[0];
        var html = `
        <div class="nBox_wrap">
            <ul>
                <h3 style="font-size:16px;font-weight:bold">${notice.title}</h3>
                <li>${notice.createDate}</li>
            </ul>
        </div>
        <p>${notice.content}</p>
        `;
        $(".noticeBox").html(html);
    }, function(err) {
        console.log(err);
    })
}

$(function() {
    getSpecificBoard();
});