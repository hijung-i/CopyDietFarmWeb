var installAppTemplate = '';

installAppTemplate += '<div class="popup_box">'
installAppTemplate += '<div class="popup_cont">'
installAppTemplate += '<div class="index-modal">'
installAppTemplate += '<p class="sale_coupon"><img src="/images/coupon_icon_friend@2x.png"></p>' 
installAppTemplate += '<span class="close" @click="closePopupModal();">x</span>' 
installAppTemplate += '<p class="app01">앱 설치하러가기</p>' 
installAppTemplate += '<p @click="closePopupModal();"><span>아니요. 그냥 웹으로 볼래요.</span></p>' 
installAppTemplate += '<a href="https://dietfarm.page.link/pzok"><p class="app02">앱 설치하기> </p></a>'
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
 
    }
}