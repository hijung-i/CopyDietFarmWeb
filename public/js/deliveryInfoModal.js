var deliveryInfoTemplate = '';

deliveryInfoTemplate += '<div class="dInfo_modal" id="dInfo_modal">'
deliveryInfoTemplate += '     <div class="modal-content">'
deliveryInfoTemplate += '         <span class="close" @click="closeModal()">&times;</span>'
deliveryInfoTemplate += '         <section class="detail_title">'
deliveryInfoTemplate += '             <h2 class="title">{{ product.productName }}</h2>'
deliveryInfoTemplate += '         </section>'
deliveryInfoTemplate += '         <div id="content" class="del_info_content" style="margin-top:40px" V-for="(product, pIdx) in delivery.products">'
deliveryInfoTemplate += '             <div class="circle_line">'
deliveryInfoTemplate += '                 <ul>'
deliveryInfoTemplate += '                     <li v-bind:class="{ \'on\': deliveryProgress.complete || deliveryProgress.level == 1 }">'
deliveryInfoTemplate += '                         <i class="circle"></i>'
deliveryInfoTemplate += '                         <p>상품인수</p>'
deliveryInfoTemplate += '                         <span></span>'
deliveryInfoTemplate += '                     </li>'
deliveryInfoTemplate += '                     <li v-bind:class="{ \'on\': deliveryProgress.complete || deliveryProgress.level == 2 }">'
deliveryInfoTemplate += '                         <i class="circle"></i>'
deliveryInfoTemplate += '                         <p>상품이동중</p>'
deliveryInfoTemplate += '                         <span></span>'
deliveryInfoTemplate += '                         <p class="d_line"></p>'
deliveryInfoTemplate += '                     </li>'
deliveryInfoTemplate += '                     <li v-bind:class="{ \'on\': deliveryProgress.complete || deliveryProgress.level == 3 }">'
deliveryInfoTemplate += '                         <i class="circle"></i>'
deliveryInfoTemplate += '                         <p>배송지도착</p>'
deliveryInfoTemplate += '                         <span></span>'
deliveryInfoTemplate += '                         <p class="d_line"></p>'
deliveryInfoTemplate += '                     </li>'
deliveryInfoTemplate += '                     <li v-bind:class="{ \'on\': deliveryProgress.complete || deliveryProgress.level == 4 }">'
deliveryInfoTemplate += '                         <i class="circle"></i>'
deliveryInfoTemplate += '                         <p>배송출발</p>'
deliveryInfoTemplate += '                         <span></span>'
deliveryInfoTemplate += '                         <p class="d_line"></p>'
deliveryInfoTemplate += '                     </li>'
deliveryInfoTemplate += '                     <li v-bind:class="{ \'on\': deliveryProgress.complete || deliveryProgress.level == 5 }">'
deliveryInfoTemplate += '                         <i class="circle"></i>'
deliveryInfoTemplate += '                         <p>배송완료</p>'
deliveryInfoTemplate += '                         <span></span>'
deliveryInfoTemplate += '                         <p class="d_line"></p>'
deliveryInfoTemplate += '                     </li>'
deliveryInfoTemplate += '                 </ul>'
deliveryInfoTemplate += '             </div>'
deliveryInfoTemplate += '             <div class="line" style="border-top:1px solid #bbb">'
deliveryInfoTemplate += '                 <div class="left">'
deliveryInfoTemplate += '                     <span class="label">보내는분</span>'
deliveryInfoTemplate += '                     <span class="value">{{ product.companyName }}</span>'
deliveryInfoTemplate += '                 </div>'
deliveryInfoTemplate += '                 <div class="right">'
deliveryInfoTemplate += '                     <span class="label">받는분</span>'
deliveryInfoTemplate += '                     <span class="value">{{ product.deliveryName }}</span>'
deliveryInfoTemplate += '                 </div>'
deliveryInfoTemplate += '             </div>'
deliveryInfoTemplate += '             <div class="line">'
deliveryInfoTemplate += '                 <span class="label">운송장번호</span>'
deliveryInfoTemplate += '                 <span class="value">{{ product.courierNo }}</span>'
deliveryInfoTemplate += '             </div>'
deliveryInfoTemplate += '            <div v-if="deliveryProgress.level != undefined && deliveryProgress.level != 0" class="d_status">'
deliveryInfoTemplate += '                <p>배송 중입니다.</p>'
deliveryInfoTemplate += '            </div>'
deliveryInfoTemplate += '            <div v-else class="d_status">'
deliveryInfoTemplate += '                <p>배송 준비 중입니다.</p>'
deliveryInfoTemplate += '            </div>'
deliveryInfoTemplate += '         </div>'
deliveryInfoTemplate += '     </div>'
deliveryInfoTemplate += '</div>'

var deliveryInfoModal = {
    template: deliveryInfoTemplate,
    props: {
        product: {
            type: Object,
            default: function() { 
                return {
                    productName: '',
                    courierName: '',
                    courierCode: '',
                    courierNo: '',
                    companyName: '',
                    deliveryName: ''
                }
            }
        }
    },
    data: function() {
        return {
            RESOURCE_SERVER,
            deliveryIndex: -1,
            deliveryProgress: {}
        }
    }, methods: {
        closeModal: function() {
            app.deliveryInfoModalShow = false;
            scrollAllow();
        },
        getDeliveryProgress: async function() {
            this.deliveryProgress = await parcelTrackSmart(this.product.courierCode, this.product.courierNo);
            console.log(this.deliveryProgress)
        }
    }, mounted: function() {
        this.getDeliveryProgress();
    }
}
function openDInfoModal() {
    app.deliveryInfoModalShow = true;
    scrollBlock();
}

