
function getEventStands() {
	var currentStandCode = $('#currentStandCode').val();
    var param = {}
    ajaxCall(API_SERVER + "/product/getEventStands", param, 'post'
    , function(data) {

		$("#header_common #nav").html('');
		var html = '';
		html += '<a href="#" class="web_cate"><img src="/images/category_ico_main.png">전체카테고리</a>';		
		console.log(data);
		for(var i = 0; i < data.result.length; i++){

			// TODO: 화면 너비가 pc버전일때 break;
			if(i == 4) break;

			var stand = data.result[i];
			if(i == 0){
				html += '<a href="/" '+ ((currentStandCode == stand.salesStandCode)?'class="is-current"':'')+'>홈</a>';
			}
			console.log(currentStandCode, stand.salesStandCode);
			if( currentStandCode == stand.salesStandCode){
				$('#heade_common #nav a').removeClass("is-current");
				html += '<a href="/products/'+ stand.salesStandCode + '/event" class="is-current">'+ stand.salesStandName +'</a>';
			} else {
				html += '<a href="/products/'+ stand.salesStandCode + '/event" >'+ stand.salesStandName +'</a>';
			}
		}

		html += '<div class="nav-underline"></div>';
		console.log(html);
		$('#header_common #nav').html(html);

        // web size side menu set
		$('.web_cate').click(function() {
            var isActive = $('.web_cate').hasClass("active");
            if( isActive ){
                sideTabClose();
            } else {
                sideTabOpen();
            }
		});

    }, function(err) {
        sideTabClose();
        console.log("eventStands err", err);
    })
} 

function sideTabOpen() {

    var x = $('.web_cate').offset().left;
    var y = $('.web_cate').offset().top;
    var height = $('.web_cate').outerHeight();

    $('.sideMenu').show().animate({
        left: x
    });
    $('.sideMenu').css({
        //'position': 'absolute',
        'top':y + height
        // width:100% disabled
    });
    
    $('.web_cate').addClass('active');
}
function sideTabClose() {
    $('.web_cate').removeClass('active');
    $('.sideMenu').animate({
        left: -100 + '%'
    }, function() {
        $('.sideMenu').hide();
    });
}
$(function() {
    getEventStands();

    $('ul.tab_wrap li').click(function() {
        var activeTab = $(this).attr('data-tab');
        $('.tab_wrap li').removeClass('active');
        $('.tab_cont').removeClass('active');
        $(this).addClass('active');
        $('#' + activeTab).addClass('active');
    })
    
    $(".mDepth01>li>dl>dt").click(function() {
        var objA = $(this).next("dd");
        /*if(objA.css("display") != "none"){
            objA.prev('dt').removeClass("on");
            objA.hide();
        } else {*/
            jQuery('.mDepth01>li>dl>dd').css('display','none');
            jQuery('.mDepth01>li>dl>dt').removeClass("on");
            objA.prev('dt').addClass("on");
            objA.slideDown();
    // }
    });

    jQuery('.side_back').bind("touchend click", function(){
        sideMenu('off');
    });
    
    $(window).resize(function(){
        var winW = $(window).width();
        if (winW > 1080) {
            sideMenu('off');
            jQuery('#m_search').hide();
        }  else {
            $(".main_gnb>li").removeClass("on");
            $('.main_gnb>li.current').each(function() {
                $(this).addClass("on");
            });
            $("#all_gnb").hide();
            $("#all_gnb").removeClass("hover");
            $('.depth1menu>li').removeClass("on");
            $('.depth1menu>li.current').each(function() {
                $(this).addClass("on");
            });
            $('.gnb_depth02>li').removeClass("on");
            $('.gnb_depth02>li.current').addClass("on");
        }
    })
   
    // 햄버거 메뉴
    $(document).ready(function() {
        $('.btnMenu>a').click(function() {
            sideTabOpen();
            $('body').css ({
                position:'fixed',
                overflow:'hidden'
            });
            $('.sideMenu').css ({
                
            })
        });

        $('.slideMenu_close>a').click(function() {
            sideTabClose();
            $('body').css ({
                position:'relative',
                overflow:'visible'
            });
        });
    });


        // 햄버거 2단계 메뉴
    /* $(document).ready(function() {
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
    }); */

    $(".sideMenu").hide();
    $(".web_cate > a").click(function(){
        $(".sideMenu").slideToggle("fast");
    });


    /* web side menu controll */
    $(".m_ba_slides_n_li a").hover(function () {
        console.log($(this).find("ul"));
        $(this).find("ul").slideDown("700");

        $(".m_ba_slides_n_li a").removeClass("active");
    },
    function () {
        $("ul").slideUp("700");
    });

    $("#memberMenu").bind("moseover mouseenter", function () {
        $("#memMenu").show();
    });
    $("#memMenu").bind("moseout mouseleave", function () {
        $("#memMenu").hide();
    });

    $("#NotmemberMenu").bind("moseover mouseenter", function () {
        $("#NotmemMenu").show();
    });
    $("#NotmemMenu").bind("moseout mouseleave", function () {
        $("#NotmemMenu").hide();
    });

    $(".open_close").click(function () {
        $(".toggle").toggle();
    });

    $(".open_close2").click(function () {
        $(".toggle2").toggle();
    });
    
    $(".open_close3").click(function () {
        $(".toggle3").toggle();
    });
});

/* 체크박스 전체 선택 */
function selectAll(selectAll)  {
    const checkboxes 
         = document.getElementsByName('list');
    
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAll.checked;
    })
  }



/* 주문 내역 > 주문 상세 > 리뷰 lnb 화면전환 */
$(function(){
    $("ul.tab_wrap #possible").click(function(){
        $("div#tab1").hide();
        $("div#tab2").show();
    });

    $("ul.tab_wrap .on").click(function(){
        $("div#tab2").hide();
        $("div#tab1").show();
    });

    $('.tabMenu_review li').on('click',function(){
        $(this).addClass('on');
        $(this).siblings().removeClass('on');
    });

    /* $("tr.faq_q").click(function() {
        if ($(this).next('tr').css("display") != "none") {
            $(this).next('tr').hide();
            $(this).removeClass("current");
        } else {
            $("tr.faq_a").css('display', 'none');
            $("tr.faq_q").removeClass("current");
            $(this).next('tr').show();
            $(this).addClass("current");
        }
    }); */

    $(".start1").click(function () {
        $(".fade1").toggle();
    });

    $(".start2").click(function () {
        $(".fade2").toggle();
    });

    $(".start3").click(function () {
        $(".fade3").toggle();
    });

    $('.content_lnb li').click(function(){
        $('.content_lnb li').removeClass()
            $(this).addClass('on')
    });

    $(".content_lnb li.fir").click(function(){
        $("div.block").hide();
        $("div.tab3").show();
    });

    $(".content_lnb li.sec").click(function(){
        $("div.block").hide();
        $("div.tab4").show();
    });

    $(".content_lnb li.thi").click(function(){
        $("div.block").hide();
        $("div.tab5").show();
    });

    $(".content_lnb li.for").click(function(){
        $("div.block").hide();
        $("div.tab6").show();
    });

    $(".content_lnb li.fiv").click(function(){
        $("div.block").hide();
        $("div.tab7").show();
    });

    $(".content_lnb li.six").click(function(){
        $("div.block").hide();
        $("div.tab8").show();
    });

    $(".content_lnb li.sev").click(function(){
        $("div.block").hide();
        $("div.tab9").show();
    });

    $(".clsWindow>i").click(function(){
        $("#ex1,.blocker").hide();
    })

    $(".ordlist_clsWindow>i").click(function(){
        $("#ex1,.blocker").hide();
    })

});

/* 롤링 배너 */
//client rolling banner
   window.onload = function() {
            var bannerLeft=0;
            var first=1;
            var last;
            var imgCnt=0;
            var $img = $(".main_banner img");
            var $first;
            var $last;

            $img.each(function(){   // 1px 간격으로 배너 처음 위치 시킴
                $(this).css("left",bannerLeft);
                bannerLeft += $(this).width()+0;
                $(this).attr("id", "banner"+(++imgCnt));  // img에 id 속성 추가
            });

            
            if( imgCnt > 1){                //배너 9개 이상이면 이동시킴



                last = imgCnt;

                setInterval(function() {
                    $img.each(function(){
                        $(this).css("left", $(this).position().left-2); // 2px씩 왼쪽으로 이동
                    });
                    $first = $("#banner"+first);
                    $last = $("#banner"+last);
                    if($first.position().left < -360) {    // 제일 앞에 배너 제일 뒤로 옮김
                        $first.css("left", $last.position().left + $last.width()+5 );
                        first++;
                        last++;
                        if(last > imgCnt) { last=1; }   
                        if(first > imgCnt) { first=1; }
                    }
                }, 40);   //여기 값을 조정하면 속도를 조정할 수 있다.(위에 1px 이동하는 부분도 조정하면 

//깔끔하게 변경가능하다           

 }

};