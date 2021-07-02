var deliveryInfoModalTemplate = '';

deliveryInfoModalTemplate += '<div class="i_modal" id="iModal" style="display:none" >';
deliveryInfoModalTemplate += '    <div class="modal-content">';
deliveryInfoModalTemplate += '        <div class="modal_ctn">';
deliveryInfoModalTemplate += '            <div class="modalTop_ctn">';
deliveryInfoModalTemplate += '                <div class="modalTop_tit">';
deliveryInfoModalTemplate += '                    <h3>배송지 관리</h3>';
deliveryInfoModalTemplate += '                    <span class="close" onclick="closeInfoModal()">&times;</span>';
deliveryInfoModalTemplate += '                </div>';
deliveryInfoModalTemplate += '                <h3 class="order_delMag">배송지 변경</h3>';
deliveryInfoModalTemplate += '            </div>';
deliveryInfoModalTemplate += '            <div class="slim_line_del_switch_modal"></div>';
deliveryInfoModalTemplate += '            <div class="top_checkBox">';
deliveryInfoModalTemplate += '                <input type="checkbox" name="list" id="selectAll1" value="selectAll"';
deliveryInfoModalTemplate += '                    onclick="selectAll(this)">';
deliveryInfoModalTemplate += '                <label for="selectAll1">전체 선택</label>';
deliveryInfoModalTemplate += '                <button>선택 삭제</button>';
deliveryInfoModalTemplate += '            </div>';
deliveryInfoModalTemplate += '            <div class="order_list_ctn">';
deliveryInfoModalTemplate += '                <template v-for="(item, i) in deliveryList">';
deliveryInfoModalTemplate += '                    <section class="web_delivery_manage_list">';
deliveryInfoModalTemplate += '                        <div class="del_mng_list_top">';
deliveryInfoModalTemplate += '                            <ul class="del_mng_type">';
deliveryInfoModalTemplate += '                                <li class="type_first">{{ item.addressName }}</li>';
deliveryInfoModalTemplate += '                                <li class="type_second" v-if="item.mainAddressYn == \'Y\'">';
deliveryInfoModalTemplate += '                                    <span class="tema">기본배송지</span>';
deliveryInfoModalTemplate += '                                </li>';
deliveryInfoModalTemplate += '                            </ul>';
deliveryInfoModalTemplate += '                            <ul class="edit_remove">';
deliveryInfoModalTemplate += '                                <template v-if="item.mainAddressYn == \'N\'">';
deliveryInfoModalTemplate += '                                    <li class="basic" v-on:click="changeMainAddress(i)">';
deliveryInfoModalTemplate += '                                        <a>기본배송지로 설정</a>';
deliveryInfoModalTemplate += '                                    </li>';
deliveryInfoModalTemplate += '                                    <li class="small_line"><img src="/images/l_icon_category.png"></li>';
deliveryInfoModalTemplate += '                                </template>';
deliveryInfoModalTemplate += '                                <li class="edit_first">';
deliveryInfoModalTemplate += '                                    <a>수정</a>';
deliveryInfoModalTemplate += '                                </li>';
deliveryInfoModalTemplate += '                                <li class="small_line"><img src="/images/l_icon_category.png"></li>';
deliveryInfoModalTemplate += '                                <li class="edit_second">';
deliveryInfoModalTemplate += '                                    <a v-on:click="deleteDelivery(i)">삭제</a>';
deliveryInfoModalTemplate += '                                </li>';
deliveryInfoModalTemplate += '                            </ul>';
deliveryInfoModalTemplate += '                        </div>';
deliveryInfoModalTemplate += '                        <div class="web_del_mag_list_info">';
deliveryInfoModalTemplate += '                            <div class="top_checkBox_piece">';
deliveryInfoModalTemplate += '                                <input type="radio" name="list" v-on: v-bind:id="\'option\' + (i + 2)"';
deliveryInfoModalTemplate += '                                    v-on:change="onDeliveryInfoSelected()" v-bind:value="i"';
deliveryInfoModalTemplate += '                                    v-bind:checked="orderDto.delivery != undefined && item.address == orderDto.delivery.address">';
deliveryInfoModalTemplate += '                                <label v-bind:for="\' option\' + i "><span></span></label>';
deliveryInfoModalTemplate += '                            </div>';
deliveryInfoModalTemplate += '                            <ul>';
deliveryInfoModalTemplate += '                                <li class="order_info_modal_address">';
deliveryInfoModalTemplate += '                                    <p class="address">{{ item.address }}</p>';
deliveryInfoModalTemplate += '                                </li>';
deliveryInfoModalTemplate += '                                <li>';
deliveryInfoModalTemplate += '                                    <p class="customer_info">{{ item.userName }}';
deliveryInfoModalTemplate += '                                        <span class="small_line"><img';
deliveryInfoModalTemplate += '                                                src="/images/l_icon_category.png"></span>{{';
deliveryInfoModalTemplate += '                                        item.userCellNo }}';
deliveryInfoModalTemplate += '                                    </p>';
deliveryInfoModalTemplate += '                                </li>';
deliveryInfoModalTemplate += '                            </ul>';
deliveryInfoModalTemplate += '                        </div>';
deliveryInfoModalTemplate += '                    </section>';
deliveryInfoModalTemplate += '                </template>';
deliveryInfoModalTemplate += '            </div>';
deliveryInfoModalTemplate += '        </div>';
deliveryInfoModalTemplate += '    </div>';
deliveryInfoModalTemplate += '</div>';

var deliveryInfoModalComponent = {
    template: deliveryInfoModalTemplate,
    props: ["orderDto"],
    data: function() {
        return {
            deliveryList: []
        }
    },
    methods: {
        openInfoModal,
        closeInfoModal,
        getDeliveryInfoList: function() {
            var component = this;
            ajaxCallWithLogin(API_SERVER + '/user/getDeliveryInfoByUserId', {}, 'POST',
            function(data) {
                component.deliveryList = data.result;
                console.log(component);
            }, function(err) {
                console.log("err", err);
            }, {
                isRequired: true,
                userId: true
            });

        },
        reloadComponent: function() {
            console.log('reload');
            this.render += 1;
        }
    }, created: function() {
        this.getDeliveryInfoList();
    }
}

function openInfoModal() {
    $('#iModal').show();
    scrollBlock();
    
    var inputs = document.querySelectorAll('input');
    $(inputs).click(function(){
        console.log('done');
        
    });
}

function closeInfoModal() {
    $('#iModal').hide();
    scrollAllow();
}

function getDeliveryInfoList() {
    console.log(deliveryInfoModalComponent);
    ajaxCallWithLogin(API_SERVER + '/user/getDeliveryInfoByUserId', {}, 'POST',
    function(data) {
        deliveryInfoModalComponent.dataList = data.result;

    }, function(err) {
        console.log("err", err);
    }, {
        isRequired: true,
        userId: true
    })
}