var installAppTemplate = '';
installAppTemplate += '<div class="popup_layer_wrapper" id="popup-cookie">'
installAppTemplate += '<div class="popup_box">'
installAppTemplate += '<div class="popup_cont">'
installAppTemplate += '    <div class="index-modal">'
installAppTemplate += '        <div class="sale_coupon"><img src="/images/app_deit_farm_logo@2x.png" style="width:72px;height:72px">'
installAppTemplate += '        <p>장보기를 <br>더 쉽고 빠르게 <br>경험하세요!</p>'
installAppTemplate += '        </div>'
installAppTemplate += '        <a href="https://dietfarm.page.link/pzok">'
installAppTemplate += '            <p class="app02">다이어트팜 앱으로 보기 ></p>'
installAppTemplate += '        </a>'
installAppTemplate += '        <p><span><a href="javascript:;" onclick="todaycloseWin();">모바일웹으로 볼게요.</a></span></p>'
installAppTemplate += '    </div>'
installAppTemplate += '</div>'
installAppTemplate += '</div>'
installAppTemplate += '</div>'


var installAppModal = {
    template: installAppTemplate,
    methods: {
        
        closePopupModal: function() {
            app.installModal = false;
            console.log(app.installModal);
            scrollAllow();
        }
 
    }, mounted: function() {
        cookiedata = document.cookie;
        console.log(cookiedata);
        if ( cookiedata.indexOf("scookie=done") < 0 ){
            console.log('cookie 없음')
            document.getElementById('popup-cookie').style.display = 'block';
        } else {
            console.log("cookie 있음")
            document.getElementById('popup-cookie').style.display = 'none';
        }
    }
}

function setCookie( name, value, expiredays ) { 
    var todayDate = new Date();
    todayDate.setDate( todayDate.getDate() + expiredays );
    document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function todaycloseWin() {
    setCookie("scookie", "done", 1);
    document.getElementById('popup-cookie').style.display = 'none';
    scrollAllow();
}