var timedealTemplate = '';

timedealTemplate += '  <div class="timedeal" v-if="saleNow">';
timedealTemplate += '    <h2 class="mtpSlideTit only-mobile">특가 타임 SALE !</h2>';
timedealTemplate += '    <a v-bind:href="\'/product/\' + product.productCode" class="timedeal-wrapper">';
timedealTemplate += '        <div class="timer-area">';
timedealTemplate += '            <div class="product only-pc">';
timedealTemplate += '                <div class="timedeal-title">';
timedealTemplate += '                    <span><img src="/images/timedeal/free-icon-clock-996232@2x.png"></span>';
timedealTemplate += '                    <h1>특가 타임 SALE !</h1>';
timedealTemplate += '                    <span><img src="/images/timedeal/free-icon-clock-996232@2x.png"></span>';
timedealTemplate += '                </div>';
timedealTemplate += '                <div class="desc">';
timedealTemplate += '                    <p class="title">{{product.productName}}</p>';
timedealTemplate += '                    <ul>';
timedealTemplate += '                        <li class="sale">{{ numberFormat(product.discountPrice) }}원</li>';
timedealTemplate += '                        <template  v-if="product.discountPrice != product.retailPrice">';
timedealTemplate += '                           <li class="cost">{{ numberFormat(product.retailPrice) }}원</li>';
timedealTemplate += '                           <li class="ratio">{{ Math.round(product.discountRate, 0) }}%</li>';
timedealTemplate += '                        </template>';
timedealTemplate += '                    </ul>';
timedealTemplate += '                </div>';
timedealTemplate += '            </div>';
timedealTemplate += '            <div class="timer" v-if="timedealRemainingTime != undefined">';
timedealTemplate += '                <span class="bg-darkgray hour">{{ timedealRemainingTime.hour }}</span>시 <span class="bg-darkgray minute">{{timedealRemainingTime.minute}}</span>분 <span class="bg-darkgray second">{{ timedealRemainingTime.second }}</span>초 <span class="small">남음</span>';
timedealTemplate += '            </div>';
timedealTemplate += '        </div>';
timedealTemplate += '        <div class="product">';
timedealTemplate += '            <div class="thum">';
timedealTemplate += '                <img v-bind:src="RESOURCE_SERVER + product.url" alt="썸네일">';
timedealTemplate += '                <input type="hidden" name="productNo" v-bind:value="product.productNo">';
timedealTemplate += '                <input type="hidden" name="productCode" v-bind:value="product.productCode">';
timedealTemplate += '                <input type="hidden" name="zzimYn" v-bind:value="product.zzimYn">';
timedealTemplate += '            </div>';
timedealTemplate += '            <div class="desc only-mobile">';
timedealTemplate += '                <p class="title">{{product.productName}}</p>';
timedealTemplate += '                    <ul>';
timedealTemplate += '                        <li class="sale">{{numberFormat(product.discountPrice)}}원</li>';
timedealTemplate += '                        <template  v-if="product.discountPrice != product.retailPrice">';
timedealTemplate += '                           <li class="cost">{{numberFormat(product.retailPrice) }}원</li>';
timedealTemplate += '                           <li class="ratio" v-if="product.discountPrice != product.retailPrice">{{Math.round(product.discountRate, 0) }}%</li>';
timedealTemplate += '                        </template>';
timedealTemplate += '                    </ul>';
timedealTemplate += '            </div>';
timedealTemplate += '        </div>';
timedealTemplate += '       </a>';
timedealTemplate += '   </div>';


var TimedealComponent = {
    template: timedealTemplate,
    props: {
        product: {
            type: Object,
            default: function() {
                return {

                }
            }
        }
    },
    methods: {
        numberFormat
    },
    data: function() {
        return {
            RESOURCE_SERVER,
            saleNow: true,
            timedealRemainingTime: {}
        }
    }, mounted: function() {
        var component = this
        var currentTime = new Date().getTime();
        var startTime = new Date(component.product.timedealStarttime).getTime();
        var endTime = new Date(component.product.timedealEndtime).getTime();

        if(currentTime < startTime) {
            component.saleNow = false;
            return;
        }
        var remaining = endTime - currentTime;
        if(remaining <= 0) {
            component.saleNow = false;
            return;
        }
        
        setInterval(function () {
            var currentTime = new Date().getTime();
            var startTime = new Date(component.product.timedealStarttime).getTime();
            var endTime = new Date(component.product.timedealEndtime).getTime();

            if(currentTime < startTime) {
                component.saleNow = false;
                return;
            }
            var remaining = endTime - currentTime;
            if(remaining <= 0) {
                component.saleNow = false;
                return;
            }
            
            var hour = Math.floor((remaining / (1000 * 60 * 60)))
            var minute = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
            var second = Math.floor(((remaining % (1000 * 60 * 60)) % (1000 * 60)) / (1000))

            component.timedealRemainingTime = {
                hour,
                minute,
                second
            }
            
        }, 1000);
    }
}
