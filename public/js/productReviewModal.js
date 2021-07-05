var productReviewTemplate = '';

productReviewTemplate += '<div class="review_modal" id="review_Modal">'
productReviewTemplate += '<div class="modal-content">'
productReviewTemplate += '<span class="close" onclick="closeModal()">&times;</span>';
productReviewTemplate += '<div>'
productReviewTemplate += '<div class="reviewModifyBox">'
productReviewTemplate += '<h2>리뷰쓰기</h2>'
productReviewTemplate += '<div class="review01">'
productReviewTemplate += '<table>'
productReviewTemplate += '<tbody>'
productReviewTemplate += '<tr class="reviewProduct">'
productReviewTemplate += '<td>'
productReviewTemplate += '<div class="detailBox">'
productReviewTemplate += '<a href="#"><img src="images/dietfarmbread.jpg" align="left" style="width:90px;margin-right:15px"></a>'
productReviewTemplate += '<ul class="reviewProductInfo">'
productReviewTemplate += '<li>디어썸라이프</li>'
productReviewTemplate += '<li>[디어썸1]간편하고 든든한 고구마스틱 300g</li>'
productReviewTemplate += '<li>간편하고 든든한 고구마스틱 300g (20g*15개입)</li>'
productReviewTemplate += '</ul>'
productReviewTemplate += '</div>'
productReviewTemplate += '</td>'
productReviewTemplate += '</tr>'
productReviewTemplate += '</tbody>'
productReviewTemplate += '</table>'
productReviewTemplate += '</div>'
productReviewTemplate += '<div id="star_grade" class="star_grade">'
productReviewTemplate += '<p>별점으로 만족도를 선택해주세요</p>'
productReviewTemplate += '<div class="starRev">'
productReviewTemplate += '<span class="starR1 on">별1_왼쪽</span>'
productReviewTemplate += '<span class="starR2">별1_오른쪽</span>'
productReviewTemplate += '<span class="starR1">별2_왼쪽</span>'
productReviewTemplate += '<span class="starR2">별2_오른쪽</span>'
productReviewTemplate += '<span class="starR1">별3_왼쪽</span>'
productReviewTemplate += '<span class="starR2">별3_오른쪽</span>'
productReviewTemplate += '<span class="starR1">별4_왼쪽</span>'
productReviewTemplate += '<span class="starR2">별4_오른쪽</span>'
productReviewTemplate += '<span class="starR1">별5_왼쪽</span>'
productReviewTemplate += '<span class="starR2">별5_오른쪽</span>'
productReviewTemplate += '</div>'
productReviewTemplate += '</div>'
productReviewTemplate += '<ul>'
productReviewTemplate += '<li>'
productReviewTemplate += '<form>'
productReviewTemplate += '<p><textarea style="border-radius:5px;width:100%;height:153px;border-color:#BBBBBB;padding:15px"></textarea></p>'
productReviewTemplate += '</form>'
productReviewTemplate += '</li>'
productReviewTemplate += '</ul>'
productReviewTemplate += '<div class="filebox">'
productReviewTemplate += '<label for="upload">사진 (선택)</label>'
productReviewTemplate += '<input type="file" id="upload" name="upload">'
productReviewTemplate += '<div id="preview">'
productReviewTemplate += '<div class="previewBox">'
productReviewTemplate += '<ul>'
productReviewTemplate += '<li></li>'
productReviewTemplate += '<li class="p2"></li>'
productReviewTemplate += '</ul>'
productReviewTemplate += '</div>'
productReviewTemplate += '</div>'
productReviewTemplate += '<p style="clear:both;">상품과 관련없거나 부적절한 리뷰는 포인트가 지급되지 않으며 앱 내에 등록되지 않습니다.</p>'
productReviewTemplate += '</div>'
productReviewTemplate += '</div>'
productReviewTemplate += '<div class="btn_area">'
productReviewTemplate += '<button type="button" id="btnSaveProduct">저장</button>'
productReviewTemplate += '</div>'
productReviewTemplate += '</div>'
productReviewTemplate += '</div>'
productReviewTemplate += '</div>'

var productReviewModal = {
    template: productReviewTemplate,
    props: [],
    data: function() {
        return {
        
        }
    }, methods: {
    
    }
}

function openReviewModal() {
    $('#review_Modal').show();
    scrollBlock();
}

function closeModal() {
    console.log("click")
    $('#review_Modal').hide();
    scrollAllow();
}
