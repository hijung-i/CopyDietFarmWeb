$(function() {

}) 

function getFooterNotice() {
    ajaxCall(API_SERVER + '/board/getAllNotice', {}, 'POST',
    function(data) {
        
        console.log('footer', data);
    }, function(err) {
        console.error(err);
    })
}