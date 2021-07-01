var deliverRegisterModalTemplate = '';

deliverRegisterModalTemplate += '<div class="r_modal" id="rModal">';
deliverRegisterModalTemplate += '    <div class="modal-content">';
deliverRegisterModalTemplate += '        <div class="modal-content_ctn">';
deliverRegisterModalTemplate += '            <!-- modal window -->';
deliverRegisterModalTemplate += '            <header class="deliver_magHeader">';
deliverRegisterModalTemplate += '            <ul>';
deliverRegisterModalTemplate += '                <li>';
deliverRegisterModalTemplate += '                    <h2>배송지 관리</h2>';
deliverRegisterModalTemplate += '                </li>';
deliverRegisterModalTemplate += '                <li class="clsWindow">';
deliverRegisterModalTemplate += '                    <span class="close" onclick="closeRegisterModal()">&times;</span>';
deliverRegisterModalTemplate += '                </li>';
deliverRegisterModalTemplate += '            </ul>';
deliverRegisterModalTemplate += '            <h3>배송지 등록</h3>';
deliverRegisterModalTemplate += '            </header>   ';
deliverRegisterModalTemplate += '            <div class="deliver_mag_modal_ctt">';
deliverRegisterModalTemplate += '            <input type="hidden" id="selectedDeliveryNo" value="">';
deliverRegisterModalTemplate += '            <input type="hidden" id="mainAddressYn" value="">';
deliverRegisterModalTemplate += '            <p>배송지 이름</p>';
deliverRegisterModalTemplate += '            <input';
deliverRegisterModalTemplate += '                type="text"';
deliverRegisterModalTemplate += '                id="deliveryName"';
deliverRegisterModalTemplate += '                name="deliveryName"';
deliverRegisterModalTemplate += '                placeholder="배송지 이름을 입력해주세요">';
deliverRegisterModalTemplate += '            <p>받으시는 분</p>';
deliverRegisterModalTemplate += '            <input';
deliverRegisterModalTemplate += '                type="text"';
deliverRegisterModalTemplate += '                id="receiverName"';
deliverRegisterModalTemplate += '                name="receiverName"';
deliverRegisterModalTemplate += '                placeholder="받으시는 분 이름을 입력해주세요">';
deliverRegisterModalTemplate += '            <p>주소</p>';
deliverRegisterModalTemplate += '            <input type="text" id="addr" name="address" placeholder="도로명, 지번, 건물명 검색">';
deliverRegisterModalTemplate += '            <input type="text" id="addr2" name="address2">';
deliverRegisterModalTemplate += '            <p>휴대폰</p>';
deliverRegisterModalTemplate += '            <input type="text" id="userCellNo" placeholder="숫자만 입력해주세요">';
deliverRegisterModalTemplate += '            <div class="btn_area_modal">';
deliverRegisterModalTemplate += '                <button type="button" id="btnRegister">저장</button>';
deliverRegisterModalTemplate += '            </div>';
deliverRegisterModalTemplate += '            </div>';
deliverRegisterModalTemplate += '        </div>';
deliverRegisterModalTemplate += '    </div>';
deliverRegisterModalTemplate += '</div>';

var deliveryRegisterModalComponent = {
    template: deliverRegisterModalTemplate,
    props: ["deliveryList"],
    data: function() {
        return {
            dataList: this.deliveryList
        }
    }, methods: {
        openRegisterModal,
        closeRegisterModal
    }
}

function openRegisterModal() {
    $('#rModal').show();
    scrollBlock();
}

function closeRegisterModal() {
    console.log("click")
    $('#rModal').hide();
    scrollAllow();
}
