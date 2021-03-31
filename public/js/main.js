// gnb 카테고리 애니메이션
jQuery(document).ready(function () {
    $("#gnbAllMenu").hide();
    $("#btnGnbOpen").click(function () {
        $("#gnbAllMenu").slideToggle("fast");
    });
});

$(document).ready(function () {
    $(".m_slides_sub").hide();
    $(".m_ba_slides_n_w li").hover(function () {
        $("ul:not(:animated)", this).slideDown("700");

        $(".m_ba_slides_n_w li a").removeClass("active");
    },
        function () {
            $("ul", this).slideUp("700");
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
});

$(document).ready(function () {
    $(".open_close").click(function () {
        $(".toggle").toggle();
    });
});
$(document).ready(function () {
    $(".open_close2").click(function () {
        $(".toggle2").toggle();
    });
});
$(document).ready(function () {
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
$(document).ready(function(){
    $("ul.tab_wrap #possible").click(function(){
        $("div#tab1").hide();
        $("div#tab2").show();
    });
});
$(document).ready(function(){
    $("ul.tab_wrap .on").click(function(){
        $("div#tab2").hide();
        $("div#tab1").show();
    });
});

/* 주문 내역 > 주문 상세 > 리뷰 lnb 언더바 애니메이션 */ 
$(document).ready(function(){
    $('.tabMenu_review li').on('click',function(){
        $(this).addClass('on');
        $(this).siblings().removeClass('on');
    });
});

/* 상품문의 답변 열고 닫기 */
jQuery(document).ready(function() {
    $("tr.faq_q").click(function() {
        if ($(this).next('tr').css("display") != "none") {
            $(this).next('tr').hide();
            $(this).removeClass("current");
        } else {
            $("tr.faq_a").css('display', 'none');
            $("tr.faq_q").removeClass("current");
            $(this).next('tr').show();
            $(this).addClass("current");
        }
    });
});

/* select tag design plugin */

$(document).ready(function() {
    $('select').niceSelect();
  });

/* 리뷰쓰기 수정 아이콘 */ 

$(document).ready(function () {
    $(".start1").click(function () {
        $(".fade1").toggle();
    });
});
$(document).ready(function () {
    $(".start2").click(function () {
        $(".fade2").toggle();
    });
});
$(document).ready(function () {
    $(".start3").click(function () {
        $(".fade3").toggle();
    });
});

/* lnb 색깔 변경 */
$(function(){
    $('.content_lnb li').click(function(){
        $('.content_lnb li').removeClass()
            $(this).addClass('on')
    });
});

/* content_lnb 화면 전환 */
$(document).ready(function(){
    $(".content_lnb li.fir").click(function(){
        $("div.block").hide();
        $("div.tab3").show();
    });
});

$(document).ready(function(){
    $(".content_lnb li.sec").click(function(){
        $("div.block").hide();
        $("div.tab4").show();
    });
});

$(document).ready(function(){
    $(".content_lnb li.thi").click(function(){
        $("div.block").hide();
        $("div.tab5").show();
    });
});

$(document).ready(function(){
    $(".content_lnb li.for").click(function(){
        $("div.block").hide();
        $("div.tab6").show();
    });
});
$(document).ready(function(){
    $(".content_lnb li.fiv").click(function(){
        $("div.block").hide();
        $("div.tab7").show();
    });
});
$(document).ready(function(){
    $(".content_lnb li.six").click(function(){
        $("div.block").hide();
        $("div.tab8").show();
    });
});
$(document).ready(function(){
    $(".content_lnb li.sev").click(function(){
        $("div.block").hide();
        $("div.tab9").show();
    });
});

/* 모달창 이미지 클릭해서 닫기 */
/* mypage_deliver_mag */
$(document).ready(function(){
    $(".clsWindow>i").click(function(){
        $("#ex1,.blocker").hide();
    })
})

/* mypage_orderList */
$(document).ready(function(){
    $(".ordlist_clsWindow>i").click(function(){
        $("#ex1,.blocker").hide();
    })
})