var cancelOrderTemplate = '';

cancelOrderTemplate+='<div class="cancel_modal" id="cancel_modal">'
cancelOrderTemplate+='    <div class="modal-content">'
cancelOrderTemplate+='        <span class="close" @click="closeModal()">&times;</span>'
cancelOrderTemplate+='        <h3 class="web_title">주문 취소</h3>'
cancelOrderTemplate+='        <div class="inquiryBox">'
cancelOrderTemplate+='            <ul>'
cancelOrderTemplate+='                <li>'
cancelOrderTemplate+='                    <h3>주문번호</h3>'
cancelOrderTemplate+='                    <ul>'
cancelOrderTemplate+='                        <li></li>'
cancelOrderTemplate+='                    </ul>'
cancelOrderTemplate+='                </li>'
cancelOrderTemplate+='                <li>'
cancelOrderTemplate+='                    <h3>상품</h3>'
cancelOrderTemplate+='                    <ul>'
cancelOrderTemplate+='                        <li>{{ product.productName }}</li>'
cancelOrderTemplate+='                    </ul>'
cancelOrderTemplate+='                </li>'
cancelOrderTemplate+='                <li>'
cancelOrderTemplate+='                    <h3>옵션</h3>'
cancelOrderTemplate+='                    <ul>'
cancelOrderTemplate+='                        <li></li>'
cancelOrderTemplate+='                    </ul>'
cancelOrderTemplate+='                </li>'
cancelOrderTemplate+='                <li>'
cancelOrderTemplate+='                    <h3>취소유형</h3>'
cancelOrderTemplate+='                    <ul>'
cancelOrderTemplate+='                        <li>'
cancelOrderTemplate+='                            <select>'
cancelOrderTemplate+='                                <option value="*">선택</option>'
cancelOrderTemplate+='                                <option value="01">1</option>'
cancelOrderTemplate+='                                <option value="02">2</option>'
cancelOrderTemplate+='                                <option value="03">3</option>'
cancelOrderTemplate+='                                <option value="04">4</option>'
cancelOrderTemplate+='                                <option value="05">5</option>'
cancelOrderTemplate+='                            </select>'
cancelOrderTemplate+='                        </li>'
cancelOrderTemplate+='                    </ul>'
cancelOrderTemplate+='                </li>'
cancelOrderTemplate+='                <li class="words">'
cancelOrderTemplate+='                    <h3>내용</h3>'
cancelOrderTemplate+='                    <ul>'
cancelOrderTemplate+='                        <li>'
cancelOrderTemplate+='                            <form>'
cancelOrderTemplate+='                                <p>'
cancelOrderTemplate+='                                    <textarea style="border-radius:5px;width:100%;height:153px;border:1px solid #BBBBBB;padding:15px;font-size:14px" placeholder="문의하실 내용을 입력해주세요"></textarea>'
cancelOrderTemplate+='                                </p>'
cancelOrderTemplate+='                            </form>'
cancelOrderTemplate+='                        </li>'
cancelOrderTemplate+='                    </ul>'
cancelOrderTemplate+='                </li>'
cancelOrderTemplate+='            </ul>'
cancelOrderTemplate+='                <div class="btn_area ordercancel">'
cancelOrderTemplate+='                    <button type="button" id="btnCancel" style="margin: 0;">등록</button>'
cancelOrderTemplate+='                </div>'
cancelOrderTemplate+='            </div>'
cancelOrderTemplate+='        </div>'
cancelOrderTemplate+='    </div>'
cancelOrderTemplate+='</div>'

var cancelOrderModal = {
    template: cancelOrderTemplate,
    props: {
        product: {
            type: Object,
            default: function() {
                return {}
            },
        
        
        
        }
    },
    data: function() {
        return {
            RESOURCE_SERVER,
       
        }
    }, methods: {
        closeModal: function() {
            this.$emit('close', 'order')
            scrollAllow();
        }

    }
}
