var productInquiryTemplate = '';

productInquiryTemplate += '<div class="inquiry_modal" id="inquiry_Modal">'
productInquiryTemplate += '     <div class="modal-content">'
productInquiryTemplate += '         <span class="close" onclick="closeModal02()">&times;</span>'
productInquiryTemplate += '         <div>'
productInquiryTemplate += '             <div class="productInquiryBox">'
productInquiryTemplate += '             <h3>(아임월) 굿밸런스 라이트밀 도시락</h3>'
productInquiryTemplate += '             <form>'
productInquiryTemplate += '                 <p><textarea style="border-radius:5px;width:330px;height:153px;border: 1px solid #BBBBBB" placeholder="문의하실 내용을 입력해주세요"></textarea></p>'
productInquiryTemplate += '             </form>'
productInquiryTemplate += '             <div class="group">'
productInquiryTemplate += '                 <input type="checkbox" id="secret">'
productInquiryTemplate += '                 <label for="secret" class="secret">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;비밀글 선택시 작성자만 조회 가능합니다.</label>'
productInquiryTemplate += '             </div>'
productInquiryTemplate += '         </div>'
productInquiryTemplate += '         <div class="btn_area">'
productInquiryTemplate += '             <button type="button" id="btnInquiry">등록</button>'
productInquiryTemplate += '         </div>'
productInquiryTemplate += '     </div>'
productInquiryTemplate +=      '</div>'
productInquiryTemplate += '</div>'

var productInquiryModal = {
    template: productInquiryTemplate,
    props: [],
    data: function() {
        return {
        
        }
    }, methods: {
    
    }
}
function openInquiryModal() {
    $('#inquiry_Modal').show();
    scrollBlock();
}

function closeModal02() {
    console.log("click")
    $('#inquiry_Modal').hide();
    scrollAllow();
}
