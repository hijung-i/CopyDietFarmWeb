$(function() {
    getFooterNotice();
}) 

function getFooterNotice() {
    ajaxCall(API_SERVER + '/board/getAllNotice', {}, 'POST',
    function(data) {
        console.log('footer', data);
        var html = '';
        for(var i = 0; i < 2; i++) {
            var notice = data.result[i];
            html += '<li><a href="/notice/'+notice.boardNo+'">'+ notice.title +'</a></li>'
        }
        $('.footer-notice ul').html(html);
    }, function(err) {
        console.error(err);
    })
}