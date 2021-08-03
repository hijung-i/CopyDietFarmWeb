var installAppTemplate = '';

installAppTemplate += '<div class="popup_box">'
installAppTemplate += '<div class="popup_cont">'
installAppTemplate += '<div class="index-modal">'
installAppTemplate += '<span class="close" @click="closePopupModal();">x</span>' 
installAppTemplate += '<p class="app01">앱 설치 바로가기!</p>'
installAppTemplate += '<p class="app03" @click="closePopupModal();>아니요. 그냥 웹으로 볼래요.</p>' 
installAppTemplate += '<a href="https://play.google.com/store/apps/details?id=com.dietFarm"><p class="app02">앱 설치하기 </p></a>'
installAppTemplate += '</div>' 
installAppTemplate += '</div>'
installAppTemplate += '</div>'

var installAppModal = {
    template: installAppTemplate,
    methods: {
        
        closePopupModal: function() {
            $('.popup_layer_wrapper').hide();
            $('html,body').css({'overflow':'visible'});
            $('html,body').off('scroll touchmove mousewheel');
        }
 
    }
}