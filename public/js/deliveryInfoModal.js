var deliveryInfoTemplate = '';

deliveryInfoTemplate+='<div class="dInfo_modal" id="dInfo_modal">'
deliveryInfoTemplate+='<div class="modal-content">'
deliveryInfoTemplate+='<span class="close" @click="closeModal()">&times;</span>'
deliveryInfoTemplate+='<section class="detail_title">'
deliveryInfoTemplate+='<h2 class="title">{{ product.productName }}</h2>'
deliveryInfoTemplate+='</section>'
deliveryInfoTemplate+='<div id="content" class="del_info_content" style="margin-top:40px" V-for="(product, pIdx) in delivery.products">'
deliveryInfoTemplate+=' <div class="circle_line" v-model="deliveryIndex" v-bind:value="index">'
deliveryInfoTemplate+='        <div class="line">'
deliveryInfoTemplate+='        </div>'
deliveryInfoTemplate+='        <ul>'
deliveryInfoTemplate+='            <li><img src="images/one_icon_order.png">'
deliveryInfoTemplate+='            <p>상품인수</p>'
deliveryInfoTemplate+='            <span></span>'
deliveryInfoTemplate+='            <p class="d_line" style="border-top:1px solid #F99319"></p>'
deliveryInfoTemplate+='            </li>'
deliveryInfoTemplate+='            <li><img src="images/one_icon_order.png">'
deliveryInfoTemplate+='            <p>상품이동중</p>'
deliveryInfoTemplate+='            <span></span>'
deliveryInfoTemplate+='            <p class="d_line" style="border-top:1px solid #F99319"></p>'
deliveryInfoTemplate+='            </li>'
deliveryInfoTemplate+='            <li><img src="images/one_icon_order.png">'
deliveryInfoTemplate+='            <p>배송지도착</p>'
deliveryInfoTemplate+='            <span></span>'
deliveryInfoTemplate+='            <p class="d_line" style="border-top:1px solid #F99319"></p>'
deliveryInfoTemplate+='            </li>'
deliveryInfoTemplate+='            <li><img src="images/one_icon_order.png">'
deliveryInfoTemplate+='            <p>배송출발</p>'
deliveryInfoTemplate+='            <span></span>'
deliveryInfoTemplate+='            <p class="d_line" style="border-top:1px solid #F99319"></p>'
deliveryInfoTemplate+='            </li>'
deliveryInfoTemplate+='            <li><img src="images/one_icon_order.png">'
deliveryInfoTemplate+='            <p>배송완료</p>'
deliveryInfoTemplate+='            <span></span>'
deliveryInfoTemplate+='            </li>'
deliveryInfoTemplate+='        </ul>'
deliveryInfoTemplate+='    </div>'
deliveryInfoTemplate+='    <div class="addr" style="border-top:1px solid #bbb">'
deliveryInfoTemplate+='        <div class="addr01">'
deliveryInfoTemplate+='            <ul>'
deliveryInfoTemplate+='                <li class="p">보내는분</li>'
deliveryInfoTemplate+='                <li class="a">{{ companyName }}</li>'
deliveryInfoTemplate+='            </ul>'
deliveryInfoTemplate+='        </div>'
deliveryInfoTemplate+='        <div class="addr02">'
deliveryInfoTemplate+='            <ul>'
deliveryInfoTemplate+='                <li class="p">받는분</li>'
deliveryInfoTemplate+='                <li class="a">{{ userName }}</li>'
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
            { return {
                onDeliveryCount: 0,
                afterDeliveryCount: 0,
                product:'',
                courierName: '',
                courierNo: 0,
                userName:''

            } }
        },
    },
    data: function() {
        return {
            RESOURCE_SERVER,
            deliveryIndex: -1,
            product: {},
            productName:{productName},
            courierName: {courierName},
            userName:'name'
            

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

