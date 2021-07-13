var installAppTemplate = '';

installAppTemplate += '<div class="popup_box">'
installAppTemplate += '<div class="popup_cont">'
installAppTemplate += '<div class="index-modal">'
installAppTemplate += '<p class="sale_coupon"><img src="/images/sale_coupon@2x.png"></p>' 
installAppTemplate += '<span class="close" @click="closePopupModal();">x</span>' 
installAppTemplate += '<p class="app01">앱 설치 시</p>' 
installAppTemplate += '<p><span>할인 쿠폰 즉시 지급!</span></p>' 
installAppTemplate += '<a href="https://play.google.com/store/apps/details?id=com.dietFarm"><p class="app02">앱 설치하고 쿠폰받기 > </p></a>'
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