var deliveryInfoTemplate = '';

deliveryInfoTemplate+='<div class="dInfo_modal" id="dInfo_modal">'
deliveryInfoTemplate+='<div class="modal-content">'
deliveryInfoTemplate+='<span class="close" onclick="closeModal02()">&times;</span>'
deliveryInfoTemplate+='<section class="detail_title">'
deliveryInfoTemplate+='<h2 class="title">{{ product.productName }}</h2>'
deliveryInfoTemplate+='<div class="btnback">'
deliveryInfoTemplate+='    <a href="#" value="취소"  onClick="history.back(); return false"><img src="/images/leftarrow_ico_my.png" alt="">'
deliveryInfoTemplate+='    </a>'
deliveryInfoTemplate+='</div>'
deliveryInfoTemplate+='</section>'
deliveryInfoTemplate+='<div id="content" class="del_info_content" style="margin-top:40px">'
deliveryInfoTemplate+='<div class="circle_line">'
deliveryInfoTemplate+='    <div class="line"></div>'
deliveryInfoTemplate+='    <ul>'
deliveryInfoTemplate+='        <li><img src="/images/one_icon_order.png"></li>'
deliveryInfoTemplate+='        <li><img src="/images/one_icon_order.png"></li>'
deliveryInfoTemplate+='        <li><img src="/images/one_icon_order.png"></li>'
deliveryInfoTemplate+='        <li><img src="/images/one_icon_order.png"></li>'
deliveryInfoTemplate+='        <li><img src="/images/one_icon_order.png"></li>'
deliveryInfoTemplate+='    </ul>'
deliveryInfoTemplate+='</div>'
deliveryInfoTemplate+='<div class="d_state">'
deliveryInfoTemplate+='    <ul>'
deliveryInfoTemplate+='        <li>상품인수</li>'
deliveryInfoTemplate+='        <li>상품이동중</li>'
deliveryInfoTemplate+='        <li>배송지도착</li>'
deliveryInfoTemplate+='        <li>배송출발</li>'
deliveryInfoTemplate+='        <li>배송도착</li>'
deliveryInfoTemplate+='    </ul>'
deliveryInfoTemplate+='</div>'
deliveryInfoTemplate+='<div class="d_date">'
deliveryInfoTemplate+='    <ul>'
deliveryInfoTemplate+='        <li>2.23</li>'
deliveryInfoTemplate+='        <li>2.23</li>'
deliveryInfoTemplate+='        <li>2.23</li>'
deliveryInfoTemplate+='        <li>2.23</li>'
deliveryInfoTemplate+='        <li>2.23</li>'
deliveryInfoTemplate+='    </ul>'
deliveryInfoTemplate+='</div>'
deliveryInfoTemplate+='<div class="addr">'
deliveryInfoTemplate+='    <div class="addr01">'
deliveryInfoTemplate+='        <ul>'
deliveryInfoTemplate+='            <li class="p">보내는분</li>'
deliveryInfoTemplate+='            <li class="a">용산</li>'
deliveryInfoTemplate+='        </ul>'
deliveryInfoTemplate+='    </div>'
deliveryInfoTemplate+='    <div class="addr02">'
deliveryInfoTemplate+='        <ul>'
deliveryInfoTemplate+='            <li class="p">받는분</li>'
deliveryInfoTemplate+='            <li class="a">역삼(대)</li>'
deliveryInfoTemplate+='        </ul>'
deliveryInfoTemplate+='    </div>'
deliveryInfoTemplate+='</div>'
deliveryInfoTemplate+='<div class="d_num">'
deliveryInfoTemplate+='    <ul>'
deliveryInfoTemplate+='        <li class="d">운송장번호</li>'
deliveryInfoTemplate+='        <li class="num">롯데택배 236308075290</li>'
deliveryInfoTemplate+='    </ul>'
deliveryInfoTemplate+='</div>'
deliveryInfoTemplate+='<div class="delivery_list_null">'
deliveryInfoTemplate+='    <img src="/images/cart_icon_order.png">'
deliveryInfoTemplate+='    <p class="no_list">배송 준비 중입니다.</p>'
deliveryInfoTemplate+='</div>'
deliveryInfoTemplate+='</div>'
deliveryInfoTemplate+='</div>'
deliveryInfoTemplate+='</div>'

var deliveryInfoModal = {
    template: deliveryInfoTemplate,
    props: {
        product: {
            type: Object,
            default: function() 
            { return {} }
        }
    },
    data: function() {
        return {
            
        }
    }, methods: {
    
    }
}
function openDInfoModal() {
    $('#dInfo_modal').show();
    scrollBlock();
}

function closeModal() {
    console.log("click")
    $('#dInfo_modal').hide();
    scrollAllow();
}