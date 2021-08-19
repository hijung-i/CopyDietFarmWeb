var sellerInquiryTemplate = '';

sellerInquiryTemplate+='<div class="s_inquiry_modal" id="s_inquiry_modal">'
sellerInquiryTemplate+='    <div class="modal-content"  style="width:auto!important;height:auto!important">'
sellerInquiryTemplate+='        <span class="close" @click="closeModal()">&times;</span>'
sellerInquiryTemplate+='        <h3 class="web_title">판매자 문의(주문건)</h3>'
sellerInquiryTemplate+='        <div class="inquiryBox">'
sellerInquiryTemplate+='            <ul>'
sellerInquiryTemplate+='                <li>'
sellerInquiryTemplate+='                    <h3>주문번호</h3>'
sellerInquiryTemplate+='                    <p>{{ product.orderNumber }}</p>'
sellerInquiryTemplate+='                </li>'
sellerInquiryTemplate+='                <li>'
sellerInquiryTemplate+='                    <h3>상품</h3>'
sellerInquiryTemplate+='                    <ul>'
sellerInquiryTemplate+='                        <li>{{ product.productName }}</li>'
sellerInquiryTemplate+='                    </ul>'
sellerInquiryTemplate+='                </li>'
sellerInquiryTemplate+='                <li>'
sellerInquiryTemplate+='                    <h3>옵션</h3>'
sellerInquiryTemplate+='                    <ul>'
sellerInquiryTemplate+='                        <li></li>'
sellerInquiryTemplate+='                    </ul>'
sellerInquiryTemplate+='                </li>'
sellerInquiryTemplate+='                <li>'
sellerInquiryTemplate+='                    <h3>문의유형</h3>'
sellerInquiryTemplate+='                    <ul>'
sellerInquiryTemplate+='                        <li>'
sellerInquiryTemplate+='                            <select>'
sellerInquiryTemplate+='                                <option value="*">선택</option>'
sellerInquiryTemplate+='                                <option value="01">상품</option>'
sellerInquiryTemplate+='                                <option value="02">배송</option>'
sellerInquiryTemplate+='                                <option value="03">반품</option>'
sellerInquiryTemplate+='                                <option value="04">교환</option>'
sellerInquiryTemplate+='                                <option value="05">기타</option>'
sellerInquiryTemplate+='                            </select>'
sellerInquiryTemplate+='                        </li>'
sellerInquiryTemplate+='                    </ul>'
sellerInquiryTemplate+='                </li>'
sellerInquiryTemplate+='                <li class="words">'
sellerInquiryTemplate+='                    <h3>내용</h3>'
sellerInquiryTemplate+='                    <ul>'
sellerInquiryTemplate+='                        <li>'
sellerInquiryTemplate+='                            <form>'
sellerInquiryTemplate+='                                <p>'
sellerInquiryTemplate+='                                    <textarea v-model="currentInquiry.content" style="border-radius:5px;width:100%;height:153px;border:1px solid #BBBBBB;padding:15px;font-size:14px" placeholder="문의하실 내용을 입력해주세요"></textarea>'
sellerInquiryTemplate+='                                </p>'
sellerInquiryTemplate+='                            </form>'
sellerInquiryTemplate+='                        </li>'
sellerInquiryTemplate+='                    </ul>'
sellerInquiryTemplate+='                </li>'
sellerInquiryTemplate+='            </ul>'
sellerInquiryTemplate+='                <div class="filebox">'
sellerInquiryTemplate+='                    <label for="upload">사진</label>'
sellerInquiryTemplate+='                    <input type="file" multiple id="upload" name="upload" @change="onFileSelected">'
sellerInquiryTemplate+='                        <div id="preview">'
sellerInquiryTemplate+='                            <div class="previewBox">'
sellerInquiryTemplate+='                                <ul>'
sellerInquiryTemplate+='                                    <li></li>'
sellerInquiryTemplate+='                                    <li class="p2"></li>'
sellerInquiryTemplate+='                                </ul>'
sellerInquiryTemplate+='                            </div>'
sellerInquiryTemplate+='                        </div>'
sellerInquiryTemplate+='                        <p>문의하신 내용에 대한 답변은 <span>마이 판매자문의</span>에서 확인하실 수 있습니다.</p>'
sellerInquiryTemplate+='                    </div>'
sellerInquiryTemplate+='                </div>'
sellerInquiryTemplate+='                <div class="btn_area sellerInq_regist">'
sellerInquiryTemplate+='                    <button type="button" id="btnModify" style="margin: 0;">등록</button>'
sellerInquiryTemplate+='                </div>'
sellerInquiryTemplate+='            </div>'
sellerInquiryTemplate+='        </div>'
sellerInquiryTemplate+='    </div>'
sellerInquiryTemplate+='</div>'

var sellerInquiryModal = {
    template: sellerInquiryTemplate,
    props: {
        product: {
            type: Object,
            default: function() {
                return {}
            },
        }, inquiry: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data: function() {
        return {
            RESOURCE_SERVER,
            currentInquiry: Object.assign({}, this.inquiry),
            fileList: new Array()
        }
    }, methods: {
        initialize,
        getOptionName: function() {
            if(this.product.options == undefined) return ''
            
            if(this.product.options.length > 1) {
                var optionName = this.product.options[0].optionDesc;
                optionName += ' 외 ' + new String(this.product.options.length - 1) + '개';
                return optionName;
            } else {
                return this.product.options[0].optionDesc
            }
        }, onStarClick: function(active, gpa) {
            var before = this.currentReview.gpa;
            console.log(before, gpa);
            this.currentReview.gpa = (active)? (gpa / 2) : (gpa / 2 + before); 
        }, onSubmit: function() {
            console.log(this.inquiry);
            if (this.inquiry.boardQA == 0) {
                console.log("문의 작성")
            } else { 
                console.log("문의 수정")
            }
        }, closeModal: function() {
            this.$emit('close', 'inquiry')
            scrollAllow();
        }, onFileSelected: function() {
            var files = document.getElementById('upload').files;
            Array.from(files).forEach(element => {
                this.currentReview.files.push(this.fileToObject(element))
            });

        }, fileToObject: function(file) {
            var object = {
                productCode: this.product.productCode,
                filename: '',
                fileType: file.type,
                url: '',
                size: file.size,
                file: file,
                updateYn: 'Y'
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                object.url =  e.target.result;
            }
            reader.readAsDataURL(file);

            return object;
        },onSubmit: function() {
            var params = {};
            Object.assign(params, this.product);
            Object.assign(params, this.currentinquiry);
           
            var contentType = 'T';
            if(params.files.length > 0) {
                contentType = 'I';
            }

            var formData = new FormData();

            Array.from(params.files).forEach(function(obj) {
                if(obj.updateYn == 'Y') formData.append("files", obj.file)
            })

            formData.append("purchaseProductNo", params.purchaseProductNo);
            formData.append("content", params.content);
            formData.append("gpa", params.gpa);
            formData.append("contentType", contentType);            

            if(params.reviewNo == undefined || params.reviewNo == 0) {
                insertReview(this, formData);
            } else {
                
            }
        },
        closeModal: function() {
            this.$emit('close', 'inquiry')
            scrollAllow();
        }

    }
}

function insertQA(comp, inquiry) {
    console.log("insertReview", inquiry);
    ajaxCallWithLogin(API_SERVER + '/board/insertQA', inquiry, 'POST',
    function(data) {
        console.log(data);
        alert('리뷰 등록에 성공했습니다.');
        comp.$emit('addComplete', inquiry);

        comp.closeModal();
    }, function(error) {
        alert('리뷰 등록에 실패했습니다.');
        console.log(error);
    },
    {
        isRequired: true,
        multipart: true,
        userId: true
    })

}

function updateQA(comp, inquiry) {

    ajaxCallMultipartFormData(API_SERVER + '/product/updateQA', inquiry, 'POST',
    function(data) {
        initialize();

        alert('리뷰 수정에 성공했습니다.');
        comp.closeModal();
    }, function(error) {
        alert('리뷰 수정에 실패했습니다.');
        console.log(error);
    },
    {
        isRequired: true,
        userId: true
    })
}

function  closeModal() {
            app.inquiryModal = false
            scrollAllow();
        }
    

function opensInquiryModal() {
    app.inquiryModal = true;
    scrollBlock();
}
