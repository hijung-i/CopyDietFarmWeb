var deliveryModalTemplate = '';

deliveryModalTemplate += '<div class="i_modal" id="iModal" style="display:none">';
deliveryModalTemplate += '    <div class="modal-content">';
deliveryModalTemplate += '        <div class="modal_ctn">';
deliveryModalTemplate += '            <div class="modalTop_ctn">';
deliveryModalTemplate += '                <div class="modalTop_tit">';
deliveryModalTemplate += '                    <h3>배송지 관리</h3>';
deliveryModalTemplate += '                    <span class="close" onclick="closeRegisterModal()">&times;</span>';
deliveryModalTemplate += '                </div>';
deliveryModalTemplate += '                <h3 class="order_delMag">배송지 변경</h3> <!-- modal window -->';
deliveryModalTemplate += '            </div>';
deliveryModalTemplate += '            <div class="slim_line_del_switch_modal"></div>';
deliveryModalTemplate += '            <div class="top_checkBox">';
deliveryModalTemplate += '                <input type="checkbox" name="list" id="selectAll1" value="selectAll"';
deliveryModalTemplate += '                    onclick="selectAll(this)">';
deliveryModalTemplate += '                <label for="selectAll1">전체 선택</label>';
deliveryModalTemplate += '                <button>선택 삭제</button>';
deliveryModalTemplate += '            </div>';
deliveryModalTemplate += '            <div class="order_list_ctn">';
deliveryModalTemplate += '                <template v-for="(item, i) in deliveryList">';
deliveryModalTemplate += '                    <section class="web_delivery_manage_list">';
deliveryModalTemplate += '                        <div class="del_mng_list_top">';
deliveryModalTemplate += '                            <ul class="del_mng_type">';
deliveryModalTemplate += '                                <li class="type_first">{{ item.addressName }}</li>';
deliveryModalTemplate += '                                <li class="type_second" v-if=\"item.mainAddressYn == "Y"\">';
deliveryModalTemplate += '                                    <span class="tema">기본배송지</span>';
deliveryModalTemplate += '                                </li>';
deliveryModalTemplate += '                            </ul>';
deliveryModalTemplate += '                            <ul class="edit_remove">';
deliveryModalTemplate += '                                <template v-if=\"item.mainAddressYn == "N"\">';
deliveryModalTemplate += '                                    <li class="basic" v-on:click="changeMainAddress(i)">';
deliveryModalTemplate += '                                        <a>기본배송지로 설정</a>';
deliveryModalTemplate += '                                    </li>';
deliveryModalTemplate += '                                    <li class="small_line"><img src="/images/l_icon_category.png"></li>';
deliveryModalTemplate += '                                </template>';
deliveryModalTemplate += '                                <li class="edit_first">';
deliveryModalTemplate += '                                    <a>수정</a>';
deliveryModalTemplate += '                                </li>';
deliveryModalTemplate += '                                <li class="small_line"><img src="/images/l_icon_category.png"></li>';
deliveryModalTemplate += '                                <li class="edit_second">';
deliveryModalTemplate += '                                    <a v-on:click="deleteDelivery(i)">삭제</a>';
deliveryModalTemplate += '                                </li>';
deliveryModalTemplate += '                            </ul>';
deliveryModalTemplate += '                        </div>';
deliveryModalTemplate += '                        <div class="web_del_mag_list_info">';
deliveryModalTemplate += '                            <div class="top_checkBox_piece">';
deliveryModalTemplate += '                                <input type="radio" name="list" v-on: v-bind:id=\""selectAll" + (i + 2)\"';
deliveryModalTemplate += '                                    v-on:change="onDeliveryInfoSelected()" v-bind:value="i"';
deliveryModalTemplate += '                                    v-bind:checked="item.address == orderDTO.delivery.address">';
deliveryModalTemplate += '                                <label v-bind:for=\""selectAll" + (i+2)\"></label>';
deliveryModalTemplate += '                            </div>';
deliveryModalTemplate += '                            <ul>';
deliveryModalTemplate += '                                <li class="order_info_modal_address">';
deliveryModalTemplate += '                                    <p class="address">{{ item.address }}</p>';
deliveryModalTemplate += '                                </li>';
deliveryModalTemplate += '                                <li>';
deliveryModalTemplate += '                                    <p class="customer_info">{{ item.userName }}';
deliveryModalTemplate += '                                        <span class="small_line"><img';
deliveryModalTemplate += '                                                src="/images/l_icon_category.png"></span>{{';
deliveryModalTemplate += '                                        item.userCellNo }}';
deliveryModalTemplate += '                                    </p>';
deliveryModalTemplate += '                                </li>';
deliveryModalTemplate += '                            </ul>';
deliveryModalTemplate += '                        </div>';
deliveryModalTemplate += '                    </section>';
deliveryModalTemplate += '                </template>';
deliveryModalTemplate += '            </div>';
deliveryModalTemplate += '        </div>';
deliveryModalTemplate += '    </div>';
deliveryModalTemplate += '</div>';

var deliveryModalComponent = {
    template: deliveryModalTemplate,
    data: function() {
        return {
            deliveryList: []
        }
    }, methods: {
        
    }
}













function closeRegisterModal() {
    console.log("click")
    $('#rModal').hide();
    $('#iModal').hide();
    $('html, body').css({'overflow': 'visible','hegiht':'auto'});
    $('html,body').off('scroll touchmove mousewheel');
}