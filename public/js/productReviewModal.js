var productReviewTemplate = '';

productReviewTemplate += '<div class="review_modal" id="review_Modal">'
productReviewTemplate += '  <div class="modal-content" >'
productReviewTemplate += '      <span class="close" @click="closeModal()">&times;</span>';
productReviewTemplate += '      <div class="review_before" v-if="currentWritable.purchaseProductNo == undefined">'
productReviewTemplate += '          <h2>리뷰쓰기</h2>'
productReviewTemplate += '          <h3>리뷰 쓸 상품을 선택해주세요.</h3>'
productReviewTemplate += '          <div class="detailBox" v-for="(writable, index) in writableList">'
productReviewTemplate += '              <input type="radio" v-model="writableReviewIndex" v-bind:value="index" class="rc">'
productReviewTemplate += '              <label for="rc" class="rc"><span><a v-bind:href="\'/product/\' + product.productCode"><img v-bind:src="RESOURCE_SERVER + product.url" align="left" style="width:50px;height:60px;margin-right:15px"></a></span></label>'
productReviewTemplate += '              <ul class="reviewProductInfo">'
productReviewTemplate += '                  <li>{{ product.companyName }}</li>'
productReviewTemplate += '                  <li>{{ product.productName }}</li>'
productReviewTemplate += '                  <li>{{ getOptionName() }}</li>'
productReviewTemplate += '              </ul>'
productReviewTemplate += '          </div>'
productReviewTemplate += '          <div class="rbtn_wrap">'
productReviewTemplate += '              <button type="button" @click="onReviewSelect()">확인</button>'
productReviewTemplate += '          </div>'
productReviewTemplate += '      </div>'
productReviewTemplate += '      <div v-if="currentWritable.purchaseProductNo != undefined">'
productReviewTemplate += '          <div class="reviewModifyBox">'
productReviewTemplate += '              <h2>리뷰쓰기</h2>'
productReviewTemplate += '              <div class="review01">'
productReviewTemplate += '                  <table>'
productReviewTemplate += '                      <tbody>'
productReviewTemplate += '                          <tr class="reviewProduct">'
productReviewTemplate += '                              <td>'
productReviewTemplate += '                                  <div class="detailBox">'
productReviewTemplate += '                                      <a v-bind:href="\'/product/\' + product.productCode"><img v-bind:src="RESOURCE_SERVER + product.url" align="left" style="width:50px;height:60px;margin-right:15px"></a>'
productReviewTemplate += '                                      <ul class="reviewProductInfo">'
productReviewTemplate += '                                          <li>{{ product.companyName }}</li>'
productReviewTemplate += '                                          <li>{{ product.productName }}</li>'
productReviewTemplate += '                                          <li>{{ getOptionName() }}</li>'
productReviewTemplate += '                                      </ul>'
productReviewTemplate += '                                  </div>'
productReviewTemplate += '                              </td>'
productReviewTemplate += '                          </tr>'
productReviewTemplate += '                      </tbody>'
productReviewTemplate += '                  </table>'
productReviewTemplate += '              </div>'
productReviewTemplate += '              <div id="star_grade" class="star_grade">'
productReviewTemplate += '                  <p>별점으로 만족도를 선택해주세요</p>'
productReviewTemplate += '                  <div class="starRev" v-if="currentReview.gpa != undefined">'
productReviewTemplate += '                  <template v-for="count in (currentReview.gpa * 2)">';
productReviewTemplate += '                      <span class="starR1 on" v-if="count % 2 == 1" v-on:click="onStarClick(true, count)">별1_왼쪽</span>';
productReviewTemplate += '                      <span class="starR2 on" v-if="count % 2 == 0" v-on:click="onStarClick(true, count)">별1_오른쪽</span>';
productReviewTemplate += '                  </template>';
productReviewTemplate += '                  <template v-for="count in (10 - (currentReview.gpa * 2))">';
productReviewTemplate += '                    <template v-if="(10 - (currentReview.gpa * 2)) % 2 == 1">';
productReviewTemplate += '                        <span class="starR1" v-if="count % 2 == 0" v-on:click="onStarClick(false, count)">별1_왼쪽</span>';
productReviewTemplate += '                        <span class="starR2" v-if="count % 2 == 1" v-on:click="onStarClick(false, count)">별1_오른쪽</span>';
productReviewTemplate += '                    </template>';
productReviewTemplate += '                    <template v-if="(10 - (currentReview.gpa * 2)) % 2 == 0">';
productReviewTemplate += '                        <span class="starR2" v-if="count % 2 == 0" v-on:click="onStarClick(false, count)">별1_오른쪽</span>';
productReviewTemplate += '                        <span class="starR1" v-if="count % 2 == 1" v-on:click="onStarClick(false, count)">별1_왼쪽</span>';
productReviewTemplate += '                    </template>';
productReviewTemplate += '                  </template>';
productReviewTemplate += '                  </div>'
productReviewTemplate += '              </div>'
productReviewTemplate += '              <form>'
productReviewTemplate += '                  <input type="hidden" value="">'
productReviewTemplate += '                  <textarea v-model="currentReview.content" style="border-radius:5px;width:100%;height:153px;border-color:#BBBBBB;padding:15px" v-html="currentReview.content"></textarea>'
productReviewTemplate += '              </form>'
productReviewTemplate += '              <div class="filebox">'
productReviewTemplate += '                   <label for="upload">사진 (선택)</label>'
productReviewTemplate += '                   <input type="file" multiple id="upload" name="upload" @change="onFileSelected">'
productReviewTemplate += '                   <div id="preview" v-if="currentReview.files != undefined && currentReview.files.length > 0">'
productReviewTemplate += '                       <div class="previewBox">'
productReviewTemplate += '                           <ul>'
productReviewTemplate += '                               <li v-for="(file, fIdx) in currentReview.files"><img v-bind:src="file"></li>'
productReviewTemplate += '                           </ul>'
productReviewTemplate += '                       </div>'
productReviewTemplate += '                   </div>'
productReviewTemplate += '                   <p style="clear:both;">상품과 관련없거나 부적절한 리뷰는 포인트가 지급되지 않으며 앱 내에 등록되지 않습니다.</p>'
productReviewTemplate += '              </div>'
productReviewTemplate += '          </div>'
productReviewTemplate += '          <div class="btn_area">'
productReviewTemplate += '              <button type="button" id="btnSaveProduct" @click="onSubmit">저장</button>'
productReviewTemplate += '          </div>'
productReviewTemplate += '      </div>'
productReviewTemplate += '  </div>'
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
                    files: [],
                    reviewNo: 0
                }
            }
        }, writableList: {
            type: Array,
            default: function() {
                return new Array()
            }
        },
        writable: {
            type: Object,
            default: function() {
                return undefined
            }
        }
    },
    data: function() {
        return {
            RESOURCE_SERVER,
            writableReviewIndex: -1,
            currentWritable: Object.assign({}, this.writable),
            currentReview: Object.assign({}, this.review),
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
        }, onReviewSelect: function() {
            // 확인 버튼 클릭시 동작
            var selectedWritable = this.writableList[this.writableReviewIndex];

            if(selectedWritable != undefined && selectedWritable.purchaseProductNo != 0) {
                console.log("writable 변경", selectedWritable);
                this.currentWritable =  selectedWritable
            }
        }, onFileSelected: function() {
            var files = document.getElementById('upload').files;
            this.currentReview.files.push(...files)
        }, fileToObject: function(file) {
            var object = {
                productCode: this.product.productCode,
                filename: '',
                fileType: file.type,
                size: file.size,
                file: file
            }
        },onSubmit: function() {
            var params = {};
            Object.assign(params, this.product);
            Object.assign(params, this.currentWritable);
            Object.assign(params, this.currentReview);
            
            console.log(params);
            if(params.purchaseProductNo == undefined || params.purchaseProductNo == 0 ) {
                alert('구매 내역을 선택해주세요')
                return;
            }
            if(params.content == ''|| params.content == undefined) {
                alert('내용을 입력해주세요');
                return;
            }

            if(params.reviewNo != undefined && params.reviewNo != 0) {
                // insertReview(this, params);
            } else {
                // updateReview(this, params);
            }
        },
        closeModal: function() {
            this.$emit('close', 'review')
            scrollAllow();
        }

    }, computed: {
        reviewLevel: function() {
            return (this.currentWritable == {} || this.currentWritable.purchaseProductNo == 0)?0:1
        } 
    }, created: function() {
        console.log(this, this.review)
        if(this.writableList == undefined || this.writableList.length == 0) {
            alert('상품 구매 후 리뷰 작성이 가능합니다.');
            this.closeModal();
            return;
        }
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

function insertReview(comp, review) {

    ajaxCallWithLogin(API_SERVER + '/product/addQA', review, 'POST',
    function(data) {
        alert('리뷰 등록에 성공했습니다.');
        comp.$emit('addComplete', review);

        comp.closeModal();
    }, function(error) {
        alert('리뷰 등록에 실패했습니다.');
        console.log(error);
    },
    {
        isRequired: true,
        userId: true
    })

}

function updateReview(comp, review) {

    ajaxCallWithLogin(API_SERVER + '/product/updateQA', review, 'POST',
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

function openReviewModal() {
    app.reviewModal = true;
    scrollBlock();
}

