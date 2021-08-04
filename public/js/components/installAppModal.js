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
installAppTemplate += '        <p @click="todaycloseWin();"><span>아니요. 그냥 웹으로 볼래요.</span></p>'
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

  $( document ).ready(function() {
        cookiedata = document.cookie;
        console.log(cookiedata);
        if ( cookiedata.indexOf("mcookie=done") < 0 ){
            console.log('cookie 없음')
            document.getElementById('popup_box').style.display = "block";
        } else {
            console.log("cookie 있음")
            document.getElementById('popup_box').style.display = "none";
        }
    });
    function setCookie( name, value, expiredays ) { 
        var todayDate = new Date();
        todayDate.setDate( todayDate.getDate() + expiredays );
        document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
    }
    
    function closeWin() {
            document.getElementById('popup_box').style.display = "none";
    
    }
    
    function todaycloseWin() {
        setCookie("mcookie", "done", 1);
        document.getElementById('popup_box').style.display = "none";
    
    }