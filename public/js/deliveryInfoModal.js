var deliveryInfoTemplate = '';

deliveryInfoTemplate += '<div class="dInfo_modal" id="dInfo_modal">'
deliveryInfoTemplate += '     <div class="modal-content">'
deliveryInfoTemplate += '         <span class="close" @click="closeModal()">&times;</span>'
deliveryInfoTemplate += '         <section class="detail_title">'
deliveryInfoTemplate += '             <h2 class="title">{{ product.productName }}</h2>'
deliveryInfoTemplate += '         </section>'
deliveryInfoTemplate += '         <div id="content" class="del_info_content">'
deliveryInfoTemplate += '             <div class="circle_line">'
deliveryInfoTemplate += '                 <ul>'
deliveryInfoTemplate += '                     <li v-bind:class="{ \'on\': deliveryProgress.complete || deliveryProgress.level >= 1 }">'
deliveryInfoTemplate += '                         <span class="circle"></span>'
deliveryInfoTemplate += '                         <p>상품인수</p>'
deliveryInfoTemplate += '                         <span></span>'
deliveryInfoTemplate += '                     </li>'
deliveryInfoTemplate += '                     <li v-bind:class="{ \'on\': deliveryProgress.complete || deliveryProgress.level >= 3 }">'
deliveryInfoTemplate += '                         <span class="circle"></span>'
deliveryInfoTemplate += '                         <p class="d_line"></p>'
deliveryInfoTemplate += '                         <p>상품이동중</p>'
deliveryInfoTemplate += '                         <span></span>'
deliveryInfoTemplate += '                     </li>'
deliveryInfoTemplate += '                     <li v-bind:class="{ \'on\': deliveryProgress.complete || deliveryProgress.level >= 4 }">'
deliveryInfoTemplate += '                         <span class="circle"></span>'
deliveryInfoTemplate += '                         <p class="d_line"></p>'
deliveryInfoTemplate += '                         <p>배송지도착</p>'
deliveryInfoTemplate += '                         <span></span>'
deliveryInfoTemplate += '                     </li>'
deliveryInfoTemplate += '                     <li v-bind:class="{ \'on\': deliveryProgress.complete || deliveryProgress.level >= 5 }">'
deliveryInfoTemplate += '                         <span class="circle"></span>'
deliveryInfoTemplate += '                         <p class="d_line"></p>'
deliveryInfoTemplate += '                         <p>배송출발</p>'
deliveryInfoTemplate += '                         <span></span>'
deliveryInfoTemplate += '                     </li>'
deliveryInfoTemplate += '                     <li v-bind:class="{ \'on\': deliveryProgress.complete || deliveryProgress.level >= 6 }">'
deliveryInfoTemplate += '                         <span class="circle"></span>'
deliveryInfoTemplate += '                         <p class="d_line"></p>'
deliveryInfoTemplate += '                         <p>배송완료</p>'
deliveryInfoTemplate += '                         <span></span>'
deliveryInfoTemplate += '                     </li>'
deliveryInfoTemplate += '                 </ul>'
deliveryInfoTemplate += '             </div>'
deliveryInfoTemplate += '             <div class="line" style="border-top:1px solid #bbb">'
deliveryInfoTemplate += '                 <div class="left">'
deliveryInfoTemplate += '                     <span class="label">보내는분</span>'
deliveryInfoTemplate += '                     <span class="value">{{ product.companyName }}</span>'
deliveryInfoTemplate += '                 </div>'
deliveryInfoTemplate += '                 <div class="right">'
deliveryInfoTemplate += '                     <span class="label">받는분</span>'
deliveryInfoTemplate += '                     <span class="value">{{ product.deliveryName }}</span>'
deliveryInfoTemplate += '                 </div>'
deliveryInfoTemplate += '             </div>'
deliveryInfoTemplate += '             <div class="line">'
deliveryInfoTemplate += '                 <span class="label">운송장번호</span>'
deliveryInfoTemplate += '                 <span class="value">{{ product.courierName }} {{ product.courierNo }}</span>'
deliveryInfoTemplate += '             </div>'
deliveryInfoTemplate += '            <div v-if="deliveryProgress.level != undefined && deliveryProgress.level != 0" class="d_status">'
deliveryInfoTemplate += '                <div  v-bind:class="{ \'date\': detail.kind == \'DATE\', \'message\': detail.kind == \'DETAIL\' }" v-for="detail in trackingDetails">'
deliveryInfoTemplate += '                   <span>{{ detail.text }}</span>'
deliveryInfoTemplate += '                </div>'
deliveryInfoTemplate += '            </div>'
deliveryInfoTemplate += '            <div v-else class="d_status">'
deliveryInfoTemplate += '                <p>배송 준비 중입니다.</p>'
deliveryInfoTemplate += '            </div>'
deliveryInfoTemplate += '         </div>'
deliveryInfoTemplate += '     </div>'
deliveryInfoTemplate += '</div>'

var deliveryInfoModal = {
    template: deliveryInfoTemplate,
    props: {
        product: {
            type: Object,
            default: function() { 
                return {
                    productName: '',
                    courierName: '',
                    courierCode: '',
                    courierNo: '',
                    companyName: '',
                    deliveryName: ''
                }
            }
        }
    },
    data: function() {
        return {
            RESOURCE_SERVER,
            deliveryIndex: -1,
            deliveryProgress: {},
            trackingDetails: []
        }
    }, methods: {
        closeModal: function() {
            app.deliveryInfoModalShow = false;
            scrollAllow();
        },
        getDeliveryProgress: async function() {
            // TODO: 배송지 정보가 있는지 Check 없으면 API 호출 후 DB에 저장
            var params = {
                purchaseProductNo: this.product.purchaseProductNo
            }
            
            var component = this;
            ajaxCall(API_SERVER + '/order/selectDeliveryState', params, 'POST',
            function(data) {
                console.log(data);
                component.deliveryProgress = data.result
                component.createTrackingDetail();
            }, function(err) {
                console.log('error 발생', err);
                if(err.responseText == 'ERROR_SERVER') {
                    console.log(component)
                    parcelTrackSmart(component.product.courierCode, component.product.courierNo)
                    .then(data => {
                        component.deliveryProgress = data;
                        var requestProduct = Object.assign({}, component.product)
                        requestProduct.deliveryStateDetail = JSON.stringify(component.deliveryProgress);
                        component.createTrackingDetail();

                        ajaxCall(API_SERVER + '/order/updateDeliveryState', requestProduct, 'POST',
                        function(data) {
                            console.log('delivery info update', data);
                        }, function(err) {
                            console.log('delivery info update failed', err);
                        })

                    }). catch(err => {
                        console.log(err);
                        alert('배송 정보를 불러오지 못했습니다. 잠시 후에 다시 시도해주세요');
                        return;
                    })
     
                }
            })

        }, 
        createTrackingDetail: function() {
            this.trackingDetails = new Array();
            Array.from(this.deliveryProgress.trackingDetails).forEach((detail, index, array) => {
                if(index > 0) {
                    if (array[index-1].timeString.substring(0, 10) != detail.timeString.substring(0, 10)) {
                        this.trackingDetails.push({ kind: 'DATE', text: detail.timeString.substring(0, 10) })
                    }
                } else {
                    this.trackingDetails.push({ kind: 'DATE',  text: detail.timeString.substring(0, 10) })
                }
                
                var text = detail.timeString.substring(11, 16) + ' [' + detail.where + '] ' + detail.kind +'했습니다.';
                this.trackingDetails.push({ kind: 'DETAIL' , text})
            })
            console.log(this.trackingDetails)
        }
    }, mounted: function() {
        this.getDeliveryProgress();
    }
}
function updateDeliveryProgress(){
    
}

function openDInfoModal() {
    app.deliveryInfoModalShow = true;
    scrollBlock();
}

