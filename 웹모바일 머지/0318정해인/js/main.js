
$(document).ready(function () {
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

// 배송지 관리 체크박스
/* window.onload = function(){
    for(var i = 0; i < document.getElementsByTagName('input').length; i++){
        if(document.getElementsByTagName('input')[i].getAttribute('type') == 'checkbox'){
            document.getElementsByTagName('input')[i].checked = true;
        }
    }
}; */

/* 체크박스 전체 선택 */
function selectAll(selectAll) {
    const checkboxes
    = document.getElementsByName('animal');

    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
}