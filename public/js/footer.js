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

// 맨 위로 
$(function(){
    $('#goingTo_top').on('click',function(e){
        e.preventDefault();
        $('html,body').animate({scrollTop:0},600);
    });
});

$(document).ready(function(){

    var navHeight = $("html,body").height(); 

    $("#goingTo_top").hide();

    $(window).scroll(function(){ 
        var rollIt = $(this).scrollTop() >= navHeight; 

    if(rollIt){ 
	        $("#goingTo_top").show().css({"position":"fixed"});
        }
        else{
            $("#goingTo_top").hide();
        }
    });
    
});