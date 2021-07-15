var deliveryInfoTemplate = '';

deliveryInfoTemplate+='<div class="dInfo_modal" id="dInfo_modal">'
deliveryInfoTemplate+='<div class="modal-content">'
deliveryInfoTemplate+='<span class="close" @click="closeModal()">&times;</span>'
deliveryInfoTemplate+='<section class="detail_title">'
deliveryInfoTemplate+='<h2 class="title">{{ product.productName }}</h2>'
deliveryInfoTemplate+='<div class="btnback">'
deliveryInfoTemplate+='    <a onclick="history.back(); return false"><img src="/images/leftarrow_ico_my.png" alt="" style="position:relative;top:-10px">'
deliveryInfoTemplate+='    </a>'
deliveryInfoTemplate+='</div>'
deliveryInfoTemplate+='</section>'
deliveryInfoTemplate+='<div id="content" class="del_info_content">'
deliveryInfoTemplate+=' <div class="circle_line">'
deliveryInfoTemplate+='        <div class="line" >'
deliveryInfoTemplate+='        </div>'
deliveryInfoTemplate+='        <ul>'
deliveryInfoTemplate+='            <li><img src="images/one_icon_order.png">'
deliveryInfoTemplate+='            <p>상품 인수</p>'
deliveryInfoTemplate+='            <span>2.23</span>'
deliveryInfoTemplate+='            </li>'
deliveryInfoTemplate+='            <li><img src="images/one_icon_order.png">'
deliveryInfoTemplate+='            <p>상품 인수</p>'
deliveryInfoTemplate+='            <span>2.23</span></li>'
deliveryInfoTemplate+='            <li><img src="images/one_icon_order.png">'
deliveryInfoTemplate+='            <p>상품 인수</p>'
deliveryInfoTemplate+='            <span>2.23</span></li>'
deliveryInfoTemplate+='            <li><img src="images/one_icon_order.png">'
deliveryInfoTemplate+='            <p>상품 인수</p>'
deliveryInfoTemplate+='            <span>2.23</span></li>'
deliveryInfoTemplate+='            <li><img src="images/one_icon_order.png">'
deliveryInfoTemplate+='            <p>상품 인수</p>'
deliveryInfoTemplate+='            <span>2.23</span></li>'
deliveryInfoTemplate+='        </ul>'
deliveryInfoTemplate+='    </div>'
deliveryInfoTemplate+='    <div class="addr">'
deliveryInfoTemplate+='        <div class="addr01">'
deliveryInfoTemplate+='            <ul>'
deliveryInfoTemplate+='                <li class="p">보내는분</li>'
deliveryInfoTemplate+='                <li class="a">용산</li>'
deliveryInfoTemplate+='            </ul>'
deliveryInfoTemplate+='        </div>'
deliveryInfoTemplate+='        <div class="addr02">'
deliveryInfoTemplate+='            <ul>'
deliveryInfoTemplate+='                <li class="p">받는분</li>'
deliveryInfoTemplate+='                <li class="a">역삼(대)</li>'
deliveryInfoTemplate+='            </ul>'
deliveryInfoTemplate+='        </div>'
deliveryInfoTemplate+='    </div>'
deliveryInfoTemplate+='    <div class="d_num">'
deliveryInfoTemplate+='        <ul>'
deliveryInfoTemplate+='            <li class="d">운송장번호</li>'
deliveryInfoTemplate+='            <li class="num">롯데택배 236308075290</li>'
deliveryInfoTemplate+='        </ul>'
deliveryInfoTemplate+='    </div>'
deliveryInfoTemplate+='   <div class="d_status">'
deliveryInfoTemplate+='       <p>배송 준비 중입니다.</p>'
deliveryInfoTemplate+='   </div>'
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
        closeModal: function() {
            app.deliveryModal = false;
            scrollAllow();
        }
    }
}
function openDInfoModal() {
    app.deliveryModal = true;
    scrollBlock();
}

