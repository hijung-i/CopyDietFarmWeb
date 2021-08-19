var productInquiryTemplate = '';

productInquiryTemplate += '<div class="inquiry_modal" id="inquiry_Modal">'
productInquiryTemplate += '     <div class="modal-content" style="width:auto!important;height:auto!important">'
productInquiryTemplate += '         <span class="close" @click="closeModal()" style="float:right">&times;</span>'
productInquiryTemplate += '         <div>'
productInquiryTemplate += '             <div class="productInquiryBox">'
productInquiryTemplate += '             <h3>{{ product.productName }}</h3>'
productInquiryTemplate += '             <form>'
productInquiryTemplate += '                 <p><textarea v-model="inquiry.content" style="border-radius:5px;height:153px;border: 1px solid #BBBBBB" placeholder="문의하실 내용을 입력해주세요"></textarea></p>'
productInquiryTemplate += '             </form>'
productInquiryTemplate += '             <div class="group">'
productInquiryTemplate += '                 <input type="checkbox" v-model="inquiry.checkbox" class="required" id="s_secret" required="required">'
productInquiryTemplate += '                 <label for="s_secret" class="s_secret">비밀글 선택시 작성자만 조회 가능합니다.</label>'
productInquiryTemplate += '             </div>'
productInquiryTemplate += '         </div>'
productInquiryTemplate += '         <div class="btn_area">'
productInquiryTemplate += '             <button type="button" id="btnInquiry" @click="onSubmit">등록</button>'
productInquiryTemplate += '         </div>'
productInquiryTemplate += '     </div>'
productInquiryTemplate +=      '</div>'
productInquiryTemplate += '</div>'

var productInquiryModal = {
    template: productInquiryTemplate,
    props: {
        product: {
           type: Object
        }, inquiry: {
            type: Object,
            default: function() {
                return {
                    qaNo: 0,
                    content: '',
                    checkbox: false
                }
            }
        }
    }, data: function() {
        return {}
    }, methods: {
        initialize,
        onSubmit: function() {
            var params = {};
            Object.assign(params, this.product);
            Object.assign(params, this.inquiry);
            
            params.checkbox = (params.checkbox)?'Y':'N'

            if(params.content == ''|| params.content == undefined) {
                alert('내용을 입력해주세요');
                return;
            }

            if(params.qaNo != undefined && params.qaNo != 0) {
                updateProductQA(this, params);
            } else {
                insertProductQA(this, params);
            }
        },
        closeModal: function() {
            this.$emit('close', 'inquiry')
            scrollAllow();
        }

    }, mounted: function() {
    }
}

function insertProductQA(comp, inquiry) {

    ajaxCallWithLogin(API_SERVER + '/product/addQA', inquiry, 'POST',
    function(data) {
        alert('문의 등록에 성공했습니다.');
        comp.$emit('addComplete', inquiry);

        comp.closeModal();
    }, function(error) {
        alert('문의 등록에 실패했습니다.');
        console.log(error);
    },
    {
        isRequired: true,
        userId: true
    })

}

function updateProductQA(comp, inquiry) {

    ajaxCallWithLogin(API_SERVER + '/product/updateQA', inquiry, 'POST',
    function(data) {
        initialize();

        alert('문의 수정에 성공했습니다.');
        comp.closeModal();
    }, function(error) {
        alert('문의 수정에 실패했습니다.');
        console.log(error);
    },
    {
        isRequired: true,
        userId: true
    })
}

function deleteProductQA(inquiry) {
    var selectedqaNo = app.inquiry[inquiry].qaNo;

    var params = {
        qaNo: selectedqaNo
    }
    
    ajaxCallWithLogin(API_SERVER + '/user/deleteProductQA', params, 'POST',
    function(data) {
        alert('삭제 되었습니다.');
        console.log("success ", data);
        modalDisplay(false);
        
        getDeliveryInfoList();
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function openInquiryModal() {
    app.inquiryModal = true;
    scrollBlock();
}
