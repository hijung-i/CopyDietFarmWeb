var deliveryInfoTemplate = '';

deliveryInfoTemplate+='<div class="dInfo_modal" id="dInfo_modal">'
deliveryInfoTemplate+='<div class="modal-content" V-for="(product, pIdx) in order.products">'
deliveryInfoTemplate+='<span class="close" @click="closeModal()">&times;</span>'
deliveryInfoTemplate+='<section class="detail_title">'
deliveryInfoTemplate+='<h2 class="title">{{ product.productName }}</h2>'
deliveryInfoTemplate+='</section>'
deliveryInfoTemplate+='<div id="content" class="del_info_content" style="margin-top:40px">'
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
deliveryInfoTemplate+='                <li class="a">{{ courierName }}</li>'
deliveryInfoTemplate+='            </ul>'
deliveryInfoTemplate+='        </div>'
deliveryInfoTemplate+='        <div class="addr02">'
deliveryInfoTemplate+='            <ul>'
deliveryInfoTemplate+='                <li class="p">받는분</li>'
deliveryInfoTemplate+='                <li class="a">{{ UserName }}</li>'
deliveryInfoTemplate+='            </ul>'
deliveryInfoTemplate+='        </div>'
deliveryInfoTemplate+='    </div>'
deliveryInfoTemplate+='    <div class="d_num">'
deliveryInfoTemplate+='        <ul>'
deliveryInfoTemplate+='            <li class="d">운송장번호</li>'
deliveryInfoTemplate+='            <li class="num">{{ courierNo }}</li>'
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
        },
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

