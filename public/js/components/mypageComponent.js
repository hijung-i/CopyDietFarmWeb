var mypageTemplate = '';

mypageTemplate += '<div class="main_contents_wrap">';
mypageTemplate += '    <div class="main_contents mypage_myinfo">';
mypageTemplate += '        <h3>마이팜</h3>';
mypageTemplate += '        <div class="main_contents_elements_wrap">';
mypageTemplate += '            <div class="mypage_member_info">';
// mypageTemplate += '            <% if (!isLoggedIn) { %>';
mypageTemplate += '                 <img src="/images/basket_ico.png" alt="바구니 아이콘">';
mypageTemplate += '                   <h3>{{userName}}님({{userId}})</h3>';
mypageTemplate += '                 <p><a href="/myinfo-modify">내정보<span><i class="fas fa-chevron-right"></i></span></a></p>';
// mypageTemplate += '            <% } %>';
mypageTemplate += '           </div>';
mypageTemplate += '           <div class="mypage_point_info frame400">';
mypageTemplate += '                <h3>포인트<img src="/images/point.png" alt="포인트 아이콘"></h3>';
// mypageTemplate += '                <% if (isLoggedIn) { %>';
mypageTemplate += '                    <p v-if="">{{ totalPointAmount }}원<span><i class="fas fa-chevron-right"></i></span></p>';
// mypageTemplate += '                <% } %>';
mypageTemplate += '            ';
mypageTemplate += '             </div>';
mypageTemplate += '         ';
mypageTemplate += '            <div class="mypage_coupon_info frame400">';
mypageTemplate += '                <h3>쿠폰<img src="/images/coupon_ico.png" alt="쿠폰 아이콘"></h3>';
mypageTemplate += '                <p v-if="">{{ usableCouponAmount }}개<span><i class="fas fa-chevron-right"></i></span></p>';
mypageTemplate += '            </div>';
mypageTemplate += '        </div>';
mypageTemplate += '    </div>';
mypageTemplate += '</div>';

var mypageComponent = {
    template: mypageTemplate,
    props: {
        totalPointAmount: {
            type: String | Number,
            default: function() { return 0 }
        },
        usableCouponAmount: {
            type: Number,
            default: function() { return 0 }
        }
    },
    data: function() {
        return {
            userName: $('#userName').val(),
            userId: $('#userId').val()
        }
    }, methods: {
        getUserInfo: function() {
            ajaxCall('/user/login', {}, 'GET',
            function(data) {
                console.log(data);
            })
        }
    }, created: function() {
        this.getUserInfo();
    }
}