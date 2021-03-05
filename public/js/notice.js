function getNotice() {
    var params = {};
    ajaxCall(API_SERVER + '/board/getAllNotice', params, 'POST'
    , function(data) {
        var result = data.result

        var html = ``;
        for(var i = 0; i < result.length; i++){
            var notice = result[i];
            html += `
            <div class="nBox_wrap">
                <ul>
                    <h3><a href="/notice/${notice.boardNo}">${notice.title}</a></h3>
                    <li>${notice.createDate}</li>
                </ul>
            </div>`;
        }
        $('.noticeBox').html(html);
        console.log("notice data", result);
    }, function(err) {
        console.log("error while getAllNotice");
    })    
}

$(function() {
    getNotice();
})