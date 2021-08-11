var installAppTemplate = '';

installAppTemplate += '<div class="popUp">'
installAppTemplate += '<div class="popup_layer_wrapper" id="popup-cookie">'
installAppTemplate += ' <div class="popup_box">'
installAppTemplate += '<div class="popup_cont">'
installAppTemplate += '    <div class="index-modal">'
installAppTemplate += '        <div class="sale_coupon"><img src="/images/app_deit_farm_logo@2x.png" style="width:72px;height:72px">'
installAppTemplate += '        <p>장보기를 <br>더 쉽고 빠르게 <br>경험하세요!</p>'
installAppTemplate += '        </div>'
installAppTemplate += '        <a href="https://dietfarm.page.link/pzok">'
installAppTemplate += '            <p class="app02">다이어트팜 앱으로 보기 ></p>'
installAppTemplate += '        </a>'
installAppTemplate += '        <p><span><a href="javascript:;" onclick="closePopup();" id="check">모바일웹으로 볼게요.</a></span></p>'
installAppTemplate += '    </div>'
installAppTemplate += '</div>'
installAppTemplate += '</div>'
installAppTemplate += '</div>'
installAppTemplate += '</div>'


var installAppModal = {
    template: installAppTemplate,
    methods: {
        todaycloseWin: function() {
            app.installModal = false;
            setCookie("ncookie", "done", 1);
            document.getElementById('popUp').style.display = "none";
            scrollAllow();
        }
    }
}
     

