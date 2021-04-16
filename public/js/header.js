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
        $('.btnMenu>a').on('click', function() {
            $('.sideMenu').show().animate({
                left: 0
            });
        });
        $('.slideMenu_close>a').on('click', function() {
            $('.sideMenu').animate({
                left: -100 + '%'
            }, function() {
                $('.sideMenu').hide();
            });
        });
    });


        // 햄버거 2단계 메뉴
    $(document).ready(function() {
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
    });
});
//웹 햄버거 열기 및 닫기
$(document).ready(function() {

    $('.btnMenu>a').on('click', function() {
        $('.gnb').hide();
    });
});
$('.slideMenu_close>a').on('click', function() {
    $('.gnb').show();
});

$(document).ready(function(){
$("#gnbAllMenu").hide();
$("#btnGnbOpen").click(function(){
    $("#gnbAllMenu").slideToggle("fast");
});
});
//웹 햄버거 depth02
$(document).ready(function() {
    $(".m_slides_sub").hide();
    $(".m_ba_slides_n_w li").hover(function(){
        $("ul:not(:animated)",this).slideDown("700");

        $(".m_ba_slides_n_w li a").removeClass("active");
    },
    function() {
        $("ul",this).slideUp("700");
       });

    $("#memberMenu").bind("moseover mouseenter",function(){
        $("#memMenu").show();
  });
   $("#memMenu").bind("moseout mouseleave",function(){
        $("#memMenu").hide();
  });

    $("#NotmemberMenu").bind("moseover mouseenter",function(){
        $("#NotmemMenu").show();
  });
   $("#NotmemMenu").bind("moseout mouseleave",function(){
        $("#NotmemMenu").hide();
  });
});
