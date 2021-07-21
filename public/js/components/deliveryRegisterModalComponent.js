
var deliverRegisterModalTemplate = '';

deliverRegisterModalTemplate += '<div class="r_modal" id="rModal">';
deliverRegisterModalTemplate += '    <div class="modal-content">';
deliverRegisterModalTemplate += '        <div class="modal-content_ctn">';
deliverRegisterModalTemplate += '            <header class="deliver_magHeader">';
deliverRegisterModalTemplate += '               <span class="close" @click="closeRegisterModal()">&times;</span>';
deliverRegisterModalTemplate += '               <h2 v-if="currentDelivery.deliveryNo == undefined || currentDelivery.deliveryNo == 0">배송지 등록</h2>';
deliverRegisterModalTemplate += '               <h2 v-if="currentDelivery.deliveryNo != undefined && currentDelivery.deliveryNo != 0">배송지 수정</h2>';
deliverRegisterModalTemplate += '            </header>';
deliverRegisterModalTemplate += '            <div class="deliver_mag_modal_ctt">';
deliverRegisterModalTemplate += '            <p>배송지 이름</p>';
deliverRegisterModalTemplate += '            <input type="text" id="deliveryName" name="deliveryName" v-model="currentDelivery.addressName" placeholder="배송지 이름을 입력해주세요">';
deliverRegisterModalTemplate += '            <p>받으시는 분</p>';
deliverRegisterModalTemplate += '            <input type="text" id="receiverName" name="receiverName" v-model="currentDelivery.userName" placeholder="받으시는 분 이름을 입력해주세요">';
deliverRegisterModalTemplate += '            <p>주소</p>';
deliverRegisterModalTemplate += '            <input type="text" id="addr" name="address" v-model="currentDelivery.address1" placeholder="도로명, 지번, 건물명 검색">';
deliverRegisterModalTemplate += '            <input type="text" id="addr2" name="address2" v-model="currentDelivery.address2">';
deliverRegisterModalTemplate += '            <p>휴대폰</p>';
deliverRegisterModalTemplate += '            <input type="text" id="userCellNo" v-model="currentDelivery.userCellNo" placeholder="숫자만 입력해주세요">';
deliverRegisterModalTemplate += '            <div class="btn_area_modal">';
deliverRegisterModalTemplate += '                <button type="button" @click="onSubmit()">저장</button>';
deliverRegisterModalTemplate += '            </div>';
deliverRegisterModalTemplate += '            </div>';
deliverRegisterModalTemplate += '        </div>';
deliverRegisterModalTemplate += '    </div>';
deliverRegisterModalTemplate += '</div>';

var deliveryRegisterModalComponent = {
    template: deliverRegisterModalTemplate,
    props: {
        delivery: {
            type: Object,
            default: function() { 
                return {
                    deliveryNo: 0
                }
            }
        }
    },
    data: function() {
        return {
            currentDelivery: Object.assign({}, this.delivery),
            double: false
        }
    }, methods: {
        openRegisterModal,
        closeRegisterModal,
        onSubmit: function() {
            if(this.currentDelivery.addressName == undefined
                || this.currentDelivery.addressName == '') {
                 alert('주소지 이름을 입력해주세요')
                 return
            }

            if(this.currentDelivery.userName == undefined
               || this.currentDelivery.userName == '') {
                alert('수령인 성명을 입력해주세요')
                return
            }

            if(this.currentDelivery.userCellNo == undefined
                || this.currentDelivery.userCellNo == '') {
                 alert('수령인 전화번호를 입력해주세요')
                 return
            }
            
            
            if(this.currentDelivery.address1 == undefined
                || this.currentDelivery.address1 == '') {
                return
            }
            var address = this.currentDelivery.address1 + this.currentDelivery.address2
            this.currentDelivery.address = address

            var delivery = Object.assign({}, this.currentDelivery);
            if (delivery.deliveryNo == undefined || delivery.deliveryNo == 0) {
                addDelivery(delivery);
            } else {
                updateDelivery(delivery);
            }
        }
        
    }, mounted: function() {
        this.double = false
        var comp = this
        $("#addr").click(function() {
            if(!comp.double) {
                comp.double = true
                openZipSearch(comp);
            }
        })

        $("#addr").keydown(function() {
            if(!comp.double) {
                comp.double = true
                openZipSearch(comp);
            }
        })
    }
}
function openZipSearch(comp) {
    new daum.Postcode({
        oncomplete: function(data) {
            console.log(comp)
            if(!comp.double) return
            comp.double = false;
            var address = data.zonecode + ", " + data.roadAddress + " ("+ data.bname +") ";
            
            var newObj = Object.assign({}, comp.currentDelivery);
            newObj.address1 = address;
            comp.currentDelivery = newObj;
        }
    }).open();
}

function openRegisterModal() {
    app.deliveryRegisterModalShow = true
    scrollBlock();
}

function addDelivery(delivery) {
    delivery.mainAddressYn = 'N'
    
    ajaxCallWithLogin(API_SERVER + '/user/insertDeliveryInfo', delivery, 'POST',
    function(data) {
        alert('배송지 추가에 성공했습니다.');
        closeRegisterModal();

        getDeliveryInfoList();
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}

function updateDelivery(delivery) {

    ajaxCallWithLogin(API_SERVER + '/user/updateDelivery', delivery, 'POST',
    function(data) {
        alert('배송지 수정에 성공했습니다.');
        console.log("success ", data);
        closeRegisterModal();
        
        getDeliveryInfoList();
    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}
function closeRegisterModal() {
    app.delivery = {}
    app.deliveryRegisterModalShow = false

    scrollAllow();
}
