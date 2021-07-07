var sellerInquiryTemplate = '';

sellerInquiryTemplate+='<div class="s_inquiry_modal" id="s_inquiry_modal">'
sellerInquiryTemplate+='    <div class="modal-content">'
sellerInquiryTemplate+='        <span class="close" @click="closeModal()">&times;</span>'
sellerInquiryTemplate+='        <h3 class="web_title">판매자 문의(주문건)</h3>'
sellerInquiryTemplate+='        <div class="inquiryBox">'
sellerInquiryTemplate+='            <ul>'
sellerInquiryTemplate+='                <li>'
sellerInquiryTemplate+='                    <h3>주문번호</h3>'
sellerInquiryTemplate+='                    <ul>'
sellerInquiryTemplate+='                        <li>2020101920201019</li>'
sellerInquiryTemplate+='                    </ul>'
sellerInquiryTemplate+='                </li>'
sellerInquiryTemplate+='                <li>'
sellerInquiryTemplate+='                    <h3>상품</h3>'
sellerInquiryTemplate+='                    <ul>'
sellerInquiryTemplate+='                        <li>(아임월)굿밸런스 라이트밀 도시락</li>'
sellerInquiryTemplate+='                    </ul>'
sellerInquiryTemplate+='                </li>'
sellerInquiryTemplate+='                <li>'
sellerInquiryTemplate+='                    <h3>옵션</h3>'
sellerInquiryTemplate+='                    <ul>'
sellerInquiryTemplate+='                        <li>1번 바질 닭가슴살 + 구운야채 도시락</li>'
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
sellerInquiryTemplate+='                                    <textarea style="border-radius:5px;width:100%;height:153px;border:1px solid #BBBBBB;padding:15px;font-size:14px" placeholder="문의하실 내용을 입력해주세요"></textarea>'
sellerInquiryTemplate+='                                </p>'
sellerInquiryTemplate+='                            </form>'
sellerInquiryTemplate+='                        </li>'
sellerInquiryTemplate+='                    </ul>'
sellerInquiryTemplate+='                </li>'
sellerInquiryTemplate+='            </ul>'

sellerInquiryTemplate+='                <div class="filebox">'
sellerInquiryTemplate+='                    <label for="upload">사진</label>'
sellerInquiryTemplate+='                    <input type="file" id="upload" name="upload">'
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
    props: [],
    data: function() {
        return {
        
        }
    }, methods: {
    
        closeModal: function () {
            app.inquiryModal = false
            scrollAllow();
        }
    }
}
function opensInquiryModal() {
    app.inquiryModal = true;
    scrollBlock();
}
