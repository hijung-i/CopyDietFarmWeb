var signModalTemplate = '';

signModalTemplate += '<div class="m_modal" id="m_Modal">'
signModalTemplate += '<div class="modal-content">';
signModalTemplate += '<span class="close" @click="closeModal()">&times;</span>';
signModalTemplate += '<div class="signup_wrap">';
signModalTemplate += '<h2>SNS 계정으로 시작하기</h2>';
signModalTemplate += '<p style="color:#6B6B6B">1초 간편 회원가입 후, </p>';
signModalTemplate += '<p class="line02"><span>10000P + 무료배송 </span>쿠폰 혜택을 받아보세요!</p>';
signModalTemplate += '<div class="signup_btn">';
signModalTemplate += '<button type="button" class="btnKakao" onclick="loginWithKakaoApi()"><img src="/images/kakao_login@2x.png">카카오 계정으로 시작하기</button>';
signModalTemplate += '<button type="button" class="btnNaver"><img src="/images/naver_login@2x.png">네이버 계정으로 시작하기</button>';
signModalTemplate += '<button type="button" id="appleid-signin" data-color="black" data-border="true" data-type="sign in" class="btnApple" onclick="AppleID.auth.signIn()"><img src="">애플 계정으로 시작하기</button>';
signModalTemplate += '</div>';
signModalTemplate += '<div class="line" style="width:100%;color:#bbbbbb">';
signModalTemplate += '</div>'
signModalTemplate += '<p style="color:#BBBBBB;margin-top:22px;margin-bottom:22.4px">또는</p>';
signModalTemplate += '<div class="signup_btn">';
signModalTemplate += '<a type="button" href="/login-form" class="loginBtn">아이디로 로그인</a>';
signModalTemplate += '</div>';
signModalTemplate += '</div>';
signModalTemplate += '</div>';
signModalTemplate += '</div>';

var signModal = {
    template: signModalTemplate,
    props: [],
    data: function() {
        return {
        
        }
    }, methods: {
        openMyModal,
        closeModal: function() {
            // 
        }
    }, mounted: function () {
        // AppleID.auth.init({
        //     clientId : 'kr.co.dietfarm',
        //     scope : 'name email',
        //     redirectURI: 'https://dietfarm.co.kr/user/callback/apple',
        //     state : '12bf1f301be5e2d81aeb514acfa3a03742c20b5e2c424938b7f90f119666445c'
        // });

        document.addEventListener('AppleIDSignInOnSuccess', function(data) {
            console.log("AppleIdSignInSuccess", data);
        })
    
        document.addEventListener('AppleIdSignInFailure', function (error) {
            console.log("AppleIdSignInFailure", error);
        })
    }
}

function openMyModal() {
    $('#m_Modal').show();
    scrollBlock();
}

function closeModal() {
    console.log("click")
    $('#m_Modal').hide();
    scrollAllow();
}
