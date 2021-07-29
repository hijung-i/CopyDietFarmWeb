var orderCancelModalTemplate = '';

orderCancelModalTemplate += '<div id="x_modal" class="cancel_modal modal-overlay">';
orderCancelModalTemplate += '    <div class="modal-content">';
orderCancelModalTemplate += '        <div class="cancel_header">';
orderCancelModalTemplate += '            <h2>주문취소</h2>';
orderCancelModalTemplate += '            <span class="close" @click="closeCancelModal()">&times;</span>';
orderCancelModalTemplate += '        </div>';
orderCancelModalTemplate += '        <div class="cancel_body">';
orderCancelModalTemplate += '            <div class="cancel_order_num cancel_body_element">';
orderCancelModalTemplate += '                <h3>주문번호</h3>';
orderCancelModalTemplate += '                <p>{{ orderCancel.orderNumber }}</p>';
orderCancelModalTemplate += '            </div>';
orderCancelModalTemplate += '            <div class="cancel_prod cancel_body_element">';
orderCancelModalTemplate += '                <h3>상품</h3>';
orderCancelModalTemplate += '                <p>{{ orderCancel.productName }}</p>';
orderCancelModalTemplate += '            </div>';
orderCancelModalTemplate += '            <div class="cancel_opt cancel_body_element">';
orderCancelModalTemplate += '                <h3>옵션</h3>';
orderCancelModalTemplate += '                <p>{{ optionDesc }}</p>';
orderCancelModalTemplate += '            </div>';
orderCancelModalTemplate += '            <div class="cancel_type cancel_body_element">';
orderCancelModalTemplate += '                <h3>취소유형</h3>';
orderCancelModalTemplate += '                <select v-model="orderCancel.cancelReason" name="#" id="#">';
orderCancelModalTemplate += '                    <option :selected="true" selected value="구매의사 취소">구매의사 취소</option>';
orderCancelModalTemplate += '                    <option v-for="(reason, index) in orderCancelReason" v-bind:value="reason">{{reason}}</option>';
orderCancelModalTemplate += '                </select>';
orderCancelModalTemplate += '            </div>';
orderCancelModalTemplate += '            <div class="cancel_content cancel_body_element">';
orderCancelModalTemplate += '                <h3>내용</h3>';
orderCancelModalTemplate += '                <textarea v-model="orderCancel.content" placeholder="취소 사유를 입력해주세요"></textarea>';
orderCancelModalTemplate += '            </div>';
orderCancelModalTemplate += '            <div class="thick_line"></div>';
orderCancelModalTemplate += '        </div>';
orderCancelModalTemplate += '        <div class="cancel_footer">';
orderCancelModalTemplate += '            <div class="cancelRegister_btn">';
orderCancelModalTemplate += '                <a href="#" @click="onSubmit()">등록</a>';
orderCancelModalTemplate += '            </div>';
orderCancelModalTemplate += '        </div>';
orderCancelModalTemplate += '    </div>';
orderCancelModalTemplate += '</div>';

var OrderCancelModal = {
    template: orderCancelModalTemplate
    , props: {
        product: {
            type: Object,
            default: function() {
                return {}
            }
        }
    }, data: function() {
        return {
            orderCancel: Object.assign({}, this.product),
            orderCancelReason: ["배송 지연", "상품 품절", "상품옵션 변경", "결제수단 변경", "구매정보 변경", "기타"]
        }
    }, methods: {
        closeCancelModal: function() {
            app.orderCancelModalShow = false
            scrollAllow();
        }, onSubmit: function() {
            console.log(this.orderCancel);
        }
    }, computed: {
        optionDesc: function() {
            var optionDesc = '';
            if(this.product.options != undefined) {
                optionDesc = this.product.options[0].optionDesc;
                if(this.product.options.length > 1) {
                    optionDesc += '외 ' + this.product.options.length - 1; 
                }
            }
            return optionDesc

        }
    }
}

function openCancelModal() {
    app.orderCancelModalShow = true;
    scrollBlock();
}