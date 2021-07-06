var productReviewTemplate = '';

productReviewTemplate += '<div class="review_modal" id="review_Modal">'
productReviewTemplate += '<div class="modal-content" >'
productReviewTemplate += '<span class="close" @click="closeModal()">&times;</span>';
productReviewTemplate += '<div v-if="product != undefined">'
productReviewTemplate += '<div class="reviewModifyBox">'
productReviewTemplate += '<h2>리뷰쓰기</h2>'
productReviewTemplate += '<div class="review01">'
productReviewTemplate += '  <table>'
productReviewTemplate += '      <tbody>'
productReviewTemplate += '          <tr class="reviewProduct">'
productReviewTemplate += '              <td>'
productReviewTemplate += '                  <div class="detailBox">'
productReviewTemplate += '                      <a v-bind:href="\'/product/\' + product.productCode"><img v-bind:src="RESOURCE_SERVER + product.url" align="left" style="width:90px;margin-right:15px"></a>'
productReviewTemplate += '                      <ul class="reviewProductInfo">'
productReviewTemplate += '                          <li>{{ product.companyName }}</li>'
productReviewTemplate += '                          <li>{{ product.productName }}</li>'
productReviewTemplate += '                          <li>{{ getOptionName() }}</li>'
productReviewTemplate += '                      </ul>'
productReviewTemplate += '                  </div>'
productReviewTemplate += '              </td>'
productReviewTemplate += '          </tr>'
productReviewTemplate += '      </tbody>'
productReviewTemplate += '  </table>'
productReviewTemplate += '</div>'
productReviewTemplate += '<div id="star_grade" class="star_grade">'
productReviewTemplate += '  <p>별점으로 만족도를 선택해주세요</p>'
productReviewTemplate += '  <div class="starRev" v-if="review.gpa != undefined">'
productReviewTemplate += '  <template v-for="count in (review.gpa * 2)">';
productReviewTemplate += '      <span class="starR1 on" v-if="count % 2 == 1" v-on:click="onStarClick(true, count)">별1_왼쪽</span>';
productReviewTemplate += '      <span class="starR2 on" v-if="count % 2 == 0" v-on:click="onStarClick(true, count)">별1_오른쪽</span>';
productReviewTemplate += '  </template>';
productReviewTemplate += '  <template v-for="count in (10 - (review.gpa * 2))">';
productReviewTemplate += '    <template v-if="(10 - (review.gpa * 2)) % 2 == 1">';
productReviewTemplate += '        <span class="starR1" v-if="count % 2 == 0" v-on:click="onStarClick(false, count)">별1_왼쪽</span>';
productReviewTemplate += '        <span class="starR2" v-if="count % 2 == 1" v-on:click="onStarClick(false, count)">별1_오른쪽</span>';
productReviewTemplate += '    </template>';
productReviewTemplate += '    <template v-if="(10 - (review.gpa * 2)) % 2 == 0">';
productReviewTemplate += '        <span class="starR2" v-if="count % 2 == 0" v-on:click="onStarClick(false, count)">별1_오른쪽</span>';
productReviewTemplate += '        <span class="starR1" v-if="count % 2 == 1" v-on:click="onStarClick(false, count)">별1_왼쪽</span>';
productReviewTemplate += '    </template>';
productReviewTemplate += '  </template>';
productReviewTemplate += '  </div>'
productReviewTemplate += '</div>'
productReviewTemplate += '<form>'
productReviewTemplate += '    <input type="hidden" value="">'
productReviewTemplate += '    <textarea style="border-radius:5px;width:100%;height:153px;border-color:#BBBBBB;padding:15px" v-html="review.content"></textarea>'
productReviewTemplate += '</form>'
productReviewTemplate += '<div class="filebox">'
productReviewTemplate += '  <label for="upload">사진 (선택)</label>'
productReviewTemplate += '  <input type="file" id="upload" name="upload">'
productReviewTemplate += '  <div id="preview" v-if="review.files != undefined && review.files.length > 0">'
productReviewTemplate += '      <div class="previewBox">'
productReviewTemplate += '          <ul>'
productReviewTemplate += '              <li></li>'
productReviewTemplate += '          </ul>'
productReviewTemplate += '      </div>'
productReviewTemplate += '  </div>'
productReviewTemplate += '  <p style="clear:both;">상품과 관련없거나 부적절한 리뷰는 포인트가 지급되지 않으며 앱 내에 등록되지 않습니다.</p>'
productReviewTemplate += '</div>'
productReviewTemplate += '</div>'
productReviewTemplate += '  <div class="btn_area">'
productReviewTemplate += '      <button type="button" id="btnSaveProduct" @click="onSubmit">저장</button>'
productReviewTemplate += '  </div>'
productReviewTemplate += '</div>'
productReviewTemplate += '</div>'
productReviewTemplate += '</div>'

var productReviewModal = {
    template: productReviewTemplate,
    props: {
        product: {
            type: Object,
            default: function() {
                return {}
            }
        }, review: {
            type: Object,
            default: function() {
                return {
                    boardNo: 0,
                    gpa: 5,
                    content: '',
                    files: []
                }
            }
        }
    },
    data: function() {
        if(this.review == null || this.review == undefined) {
        }
        return {
            RESOURCE_SERVER
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
            var before = this.review.gpa;
            this.review.gpa = (active)? (gpa / 2) : (gpa / 2 + before); 
        }, onSubmit: function() {
            console.log(this.review);
            if (this.review.boardNo == 0) {
                console.log("리뷰 작성")
            } else { 
                console.log("리뷰 수정")
            }
        }, closeModal: function() {
            this.$emit('close', 'review')
            scrollAllow();
        }

    }, computed: {
        
    }
}

function initialize() {
    return {
        boardNo: 0,
        gpa: 5,
        content: '',
        files: []
    }
}

function addReview() {
    var params = {

    }

    ajaxCallWithLogin(API_SERVER + '/insertReview')
}

function updateReview() {

}

function openReviewModal() {
    app.reviewModal = true;
    scrollBlock();
}

