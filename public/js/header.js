
function getEventStands() {
    var currentStandCode = $('#currentStandCode').val();
     var param = {}
     ajaxCall(API_SERVER + "/product/getEventStands", param, 'post'
     , function(data) {
 
       $("#header_common #nav").html('');
       var html = '';
       html += '<a class="web_cate display-flex"><img src="/images/category_ico_main.png">전체카테고리</a>';      
       for(var i = 0; i < data.result.length; i++){
 
          // TODO: 화면 너비가 pc버전일때 break;
          if(i == 4) break;
 
          var stand = data.result[i];
          if(i == 0){
             html += '<a href="/" '+ ((currentStandCode == stand.salesStandCode)?'class="is-current"':'')+'> 홈</a>';
          }
          if( currentStandCode == stand.salesStandCode){
             $('#header_common #nav a').removeClass("is-current");
             html += '<a href="/products/'+ stand.salesStandCode + '/event" class="is-current">'+ '<span>' + stand.salesStandName + '</span>' +'</a>';
          } else {
             html += '<a href="/products/'+ stand.salesStandCode + '/event" >'+ '<span>' + stand.salesStandName + '</span>' + '</a>';
          }
       }
 
       html += '<span></span>';
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
 function result(){
 if($(".result-area").css("display") == "none"){
    $(".result-area").show();
} else {
    $(".result-area").hide();
}
};

 $(function() {
     var listType = $('#listType').val();
     if(listType != 'CATEGORY') getEventStands();
     getBrandList();
     getCategory();
 
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
 
    $('body').on('click', function(e){
        var $tgPoint = $(e.target);
        var $popCallBtn = $tgPoint.hasClass('web_cate')
        var $popArea = $tgPoint.hasClass('sideMenu')
    
        if ( !$popCallBtn && !$popArea ) {
            $('.sideMenu').css("display", "none");
        }
    });
    $('body').on('click', function(e){
        var $tgPoint = $(e.target);
        var $popCallBtn = $tgPoint.hasClass('round')
        var $popArea = $tgPoint.hasClass('result-area')
    
        if ( !$popCallBtn && !$popArea ) {
            $('.result-area').css("display", "none");
        }
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
 
 /* 모바일 메인페이지 슬라이드 메뉴 카테고리 lnb 언더바 애니메이션 */
 $(document).ready(function(){
     $('.sideMenu div.tabMenu li').on('click',function(){
         console.log('clear');
         $(this).addClass('on');
         $(this).siblings().removeClass('on');
     });
     
 });
 
 /* 주문 내역 > 주문 상세 > 리뷰 lnb 화면전환 */
 $(function(){
     $("ul.tab_wrap #possible").click(function(){
         $("div#tab1").hide();
         $("div#tab2").show();
         var y = $('.brand').offset().top;
         var innerHeight = $(window).height();
         $('.brand ul').css({
             'max-height': (innerHeight - y) + 'px'
         });
     });
 
     $("ul.tab_wrap .on").click(function(){
         $("div#tab2").hide();
         $("div#tab1").show();
         // var z = $('#tab1').offset().top;
         // var innerHeight = $(window).height();
         // $('#tab1 ul').css ({
         //     'max-height' : (innerHeight - z) + 'px'
         // });
     });
 
     $('.tabMenu_review li').on('click',function(){
         $(this).addClass('on');
         $(this).siblings().removeClass('on');
     });
 
     
 
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
     if( imgCnt > 1){ //배너 9개 이상이면 이동시킴
 
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
                 last++;h
                 if(last > imgCnt) { last=1; }   
                 if(first > imgCnt) { first=1; }
             }
         }, 40); 
     }    
 
 }
 
 function getCategory() {
     var param = {};
     ajaxCall(API_SERVER + "/product/getCategoryList", param, 'post'
     , function (data) {
         var imgList = [
             '/images/salad_icon_category@2x.png',
             '/images/meal_icon_category@2x.png',
             '/images/chicken_icon_category@2x.png',
             '/images/snack_icon_category@2x.png',
             '/images/drink_icon_category@2x.png',
             '/images/fruit_icon_category@2x.png',
             '/images/vegan_icon_category@2x.png',
             '/images/baby_icon_category@2x.png',
             '/images/pet_icon_category@2x.png',
             '/images/kitchen_icon_category@2x.png',
         ];
         
         var buttonHtml = '';
         var sideTabHtml = '';
         var result = data.result;
 
         for(var i = 0; i < result.length; i++) {
             var category = result[i];
             buttonHtml += '<li>';
             buttonHtml += '<a href="/products/'+ category.category1Code +'/category/ALL">';
             buttonHtml += '<span><img src="'+ imgList[i] +'"></span>';
             buttonHtml += '<p>'+ category.category1Name +'</p>';
             buttonHtml += '</a>';
             buttonHtml += '</li>';
             
             sideTabHtml += '<li>';
             sideTabHtml += '    <dl>';
             sideTabHtml += '        <dt class="sideMenu_detail faq_q">';
             sideTabHtml += '            <span><img src="'+ imgList[i]+'" alt="#"/>'+ category.category1Name+'</span>';
             sideTabHtml += '            <img class="downArrow" src="/images/downarrow_ico_main.png"';
             sideTabHtml += '            alt="화살표" style="width:11px;height:11px">';
             sideTabHtml += '        </dt>';
             sideTabHtml += '        <dd class="subMenu faq_a" style="top: -'+ i * (54)+'px;">';
             sideTabHtml += '            <ul class="gnb_depth02">';
             
             sideTabHtml += '                <a href="/products/'+ category.category1Code+'/category/ALL">';
             sideTabHtml += '                    <li>전체보기</li>';
             sideTabHtml += '                </a>';
             for(var j = 0; j < category.category2.length; j++) {
                 var category2 = category.category2[j];
                 sideTabHtml += '            <a href="/products/'+category.category1Code+'/category/'+ category2.category2Code+'">';
                 sideTabHtml += '                <li>'+ category2.category2Name+'</li>';
                 sideTabHtml += '            </a>';
             }
 
             sideTabHtml += '            </ul>';
             sideTabHtml += '        </dd>';
             sideTabHtml += '    </dl>';
             sideTabHtml += '</li>';
         
             }
 
         // buttonHtml += '<li class = "mTabBtnMenu">';
         // buttonHtml += '<a >';
         // buttonHtml += '<span><img src="'+ imgList[10] +'"></span>';
         // buttonHtml += '<p>전체보기</p>';
         // buttonHtml += '</a>';
         // buttonHtml += '</li>';
         
    
        if($('.category ul').length > 0) {
            $('.category ul').html(buttonHtml);
        }

        $('.sideMenu_ctt #tab1 ul.mDepth01').html(sideTabHtml);

        $("dt.faq_q").click(function() {
            $("dt.faq_q").removeClass("current");
            $(this).addClass("current");
        });
 
        $('dt.faq_q').hover(function() {
            if($(window).width() >= 1079){
                $("dt.faq_q").removeClass("current");
                
                $(this).addClass("current");
            }
        })
 
        $('.sideMenu_ctt ul.mDepth01').mouseleave(function() {
            if($(window).width() >= 1079){
                $("dt.faq_q").removeClass("current");
            }
        })
        $('body').click(function() {
            if($(window).width() >= 1079){
                $(".webcate").removeClass("active");
            }
        })
         
        $(".mTabBtnMenu").on("click",function() {
            sideTabOpen();
            $('body').css ({
                position:'fixed',
                overflow:'hidden'
            });
            var z = $('#tab1').offset().top;
            var innerHeight = $(window).height();
            $('#tab1 ul').css ({
                'max-height' : (innerHeight - z) + 'px'
            });
        })
 
        console.log("getCategory => ", data);
    }, function (err){
        console.log("onError", err);
    })
 
 }
 
 function getBrandList() {
    var param = {};
    ajaxCallWithLogin(API_SERVER + '/product/getBrandList', param , 'POST',
    function(data) {
        var html = '';
        var result = data.result;
            
        for(var i = 0; i < result.length; i++) {
            var brand = result[i];
            html += '<li>';
            html += '    <a href="/products/'+ brand.companyCode +'/brand?brandName=' + brand.brandName;
            if(brand.brandCode != '') {
                html += '&brandCode='+ brand.brandCode;
            }
            
            html += '">'+ brand.brandName +'</a>';
            html += '    <button class="favorite-btn"><img class="like like-no"></button>';
            html += '</li>';
        }

        $('.brand ul').html(html);
        

    }, function(err) {
        console.error(err);
    }, {
        isRequired: false,
        userId: true
    })
 }
 
 function searchBrand(keyword) {
    var params = {
        keyword: keyword
    }
    ajaxCall(API_SERVER + '/product/brandSearchBar', params, 'POST'
    , function(data) {
        var result = data.result;
        console.log(data.result)
        var html = '';
        for(var i = 0; i < result.length; i++) {
            var brand = result[i];
            html += '<li>';
            html += '    <a href="/products/'+ brand.companyCode +'/brand?brandName=' + brand.brandName;
            if(brand.brandCode != '') {
                html += '&brandCode='+ brand.brandCode;
            }
            
            html += '">'+ brand.brandName +'</a>';
            html += '</li>'; 
        }
        $(".brand ul").html(html);


    }, function(err) {
        console.log(err);
    })
 }
 $(function() {
     $(".brandCate_top .search_box_ico").click(function() {
         var keyword = $('.brandCate_top #brandSearchKeyword').val().trim();
         if(keyword.length > 0) {
             searchBrand(keyword)
         } else {
             alert('키워드를 입력해주세요')
         }
     })
 })

$(function() {
    $(".searchbox .search_box_icon ").click(function() {
        var keyword = $('.searchbox #websearchform').val().trim();
        if(keyword.length > 0) {
            searchBrand(keyword)
        } else {
            alert('키워드를 입력해주세요')
        }
    })
})

// function goSearchResult() {
//     var keyword = $('#webSearchKeyword').val().trim();
//     if(keyword.length == '' || keyword.length < 1) {
//         alert('검색어를 입력해주세요');
//         return false;
//     }
//     
//     $("#websearchform input[name=keyword]").val(keyword);
//     $("#websearchform").submit();
// }
