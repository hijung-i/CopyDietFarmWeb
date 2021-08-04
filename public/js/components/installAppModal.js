var installAppTemplate = '';

installAppTemplate += '<div class="popup_box">'
installAppTemplate += '<div class="popup_cont">'
installAppTemplate += '    <div class="index-modal">'
installAppTemplate += '        <p class="sale_coupon"><img src="/images/diet_farm_logo.png" style="width:140px;height:80px"></p>'
installAppTemplate += '        <span class="close" @click="closePopupModal();">x</span>'
installAppTemplate += '        <p class="app01">앱 설치하러가기</p>'
installAppTemplate += '        <a href="https://dietfarm.page.link/pzok">'
installAppTemplate += '            <p class="app02">앱 설치하기</p>'
installAppTemplate += '        </a>'
installAppTemplate += '        <p><span><a href="javascript:;" onclick="todaycloseWin();"아니요. 그냥 웹으로 볼래요.</a></span></p>'
installAppTemplate += '    </div>'
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
 
    }
}
