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
orderCancelModalTemplate += '                <p v-html="productDesc"></p>';
orderCancelModalTemplate += '            </div>';
orderCancelModalTemplate += '            <div class="cancel_opt cancel_body_element">';
orderCancelModalTemplate += '                <h3>옵션</h3>';
orderCancelModalTemplate += '                <p v-html="optionDesc"></p>';
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
orderCancelModalTemplate += '            <button @click="onSubmit()" class="cancelRegister_btn">등록</button>';
orderCancelModalTemplate += '        </div>';
orderCancelModalTemplate += '    </div>';
orderCancelModalTemplate += '</div>';

var OrderCancelModal = {
    template: orderCancelModalTemplate
    , props: {
        cancelOrder: {
            type: Object,
            default: function() {
                return {}
            }
        }
    }, data: function() {
        return {
            orderCancel: Object.assign({}, this.cancelOrder),
            orderCancelReason: ["배송 지연", "상품 품절", "상품옵션 변경", "결제수단 변경", "구매정보 변경", "기타"]
        }
    }, methods: {
        closeCancelModal: function() {
            app.orderCancelModalShow = false
            scrollAllow();
        }, onSubmit: function() {
            if(this.orderCancel.cancelReason == undefined || this.orderCancel.cancelReason.length == 0) {
                alert('취소 유형을 선택해주세요');
                return;
            }

            var cancelReason = this.orderCancel.cancelReason;
            cancelReason += (this.orderCancel.content != undefined)?' ' +this.orderCancel.content: '';

            var requestOrderCancelDTO = Object.assign({}, this.orderCancel);
            console.log(requestOrderCancelDTO, cancelReason);

            requestOrderCancelDTO.cancelReason = cancelReason

            var component = this;
            ajaxCallWithLogin(API_SERVER + '/order/orderCancel', requestOrderCancelDTO, 'POST',
            function(data) {
                console.log("orderCancel Request success", data);
                alert('취소 신청이 완료되었습니다.')
                component.closeCancelModal();
                getOrderList(app.userInfo);
                
            },function( err ){
                alert('취소 신청에 실패했습니다.')
                console.log("orderCancel request faield", err)
            }, {
                isRequired: true,
                userId: true
            })
        }
    }, computed: {
        optionDesc: function() {
            var optionDesc = '';

            Array.from(this.cancelOrder.products).forEach((product) => {
                
                if(product.options != undefined) {
                    optionDesc += product.options[0].optionDesc;
                    if(product.options.length > 1) {
                        optionDesc += '외 ' + product.options.length - 1; 
                    }
                    optionDesc += '<br>';
                }
            })
            optionDesc += '<br>';
            return optionDesc
        },
        productDesc: function() {
            var productDesc = '';

            Array.from(this.cancelOrder.products).forEach((product) => {
                productDesc += product.productName + '<br>'
            })
            productDesc += '<br>';
            return productDesc

        }
    }
}

function openCancelModal() {
    app.orderCancelModalShow = true;
    scrollBlock();
}