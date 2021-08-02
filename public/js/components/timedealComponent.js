var timedealTemplate = '';

timedealTemplate += '<div class="timedeal" @click="timedealClick()">';
timedealTemplate += '  <div class="timedeal-title_mobile">';
timedealTemplate += '       <span><img src="/images/timedeal/free-icon-clock-996232@2x.png"></span>';
timedealTemplate += '       <h2 class="mtpSlideTit only-mobile">특가 타임 SALE !</h2>';
timedealTemplate += '       <span><img src="/images/timedeal/free-icon-clock-996232@2x.png"></span>';
timedealTemplate += '   </div>';
timedealTemplate += '   <div class="timedeal-wrapper">';
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
timedealTemplate += '            <div class="timer" v-if="timedealRemainingTime != undefined && type == \'O\'">';
timedealTemplate += '                <span class="bg-darkgray day">{{ timedealRemainingTime.day }}</span>일';
timedealTemplate += '                <span class="bg-darkgray hour">{{ timedealRemainingTime.hour }}</span>시';
timedealTemplate += '                <span class="bg-darkgray minute">{{timedealRemainingTime.minute}}</span>분';
timedealTemplate += '                <span class="bg-darkgray second">{{ timedealRemainingTime.second }}</span>초';
timedealTemplate += '                <span class="small">남음</span>';
timedealTemplate += '            </div>';
timedealTemplate += '            <div class="timer" v-if="type == \'B\'">';
timedealTemplate += '                <span>특가 타임 시작 시간 {{ product.timedealStarttime }}</span>';
timedealTemplate += '            </div>';
timedealTemplate += '            <div class="timer" v-if="type == \'E\'">';
timedealTemplate += '                <span>특가 타임이 종료되었습니다.</span>';
timedealTemplate += '            </div>';
timedealTemplate += '        </div>';
timedealTemplate += '        <div class="product">';
timedealTemplate += '            <div class="thum">';
timedealTemplate += '            <p class="on-img">{{ Math.round(product.discountRate) }}%</p>';
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
timedealTemplate += '   </div>';
timedealTemplate += '</div>';


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
        numberFormat,
        timedealClick: function() {
            if(this.saleNow) {
                location.href = "/product/" + this.product.productCode 
            } else {
                alert("지금은 특가 타임이 아닙니다.")
            }
        }
    },
    data: function() {
        return {
            RESOURCE_SERVER,
            saleNow: true,
            timedealRemainingTime: {},
            type: 'B'
        }
    }, mounted: function() {
        var component = this
        var currentTime = new Date().getTime();
        var startTime = new Date(component.product.timedealStarttime).getTime();
        var endTime = new Date(component.product.timedealEndtime).getTime();

        if(currentTime < startTime) {
            component.saleNow = false;
            component.type = 'B';
            return;
        }
        var remaining = endTime - currentTime;
        if(remaining <= 0) {
            component.saleNow = false;
            component.type = 'E';
            return;
        }

        component.type = 'O';
        
        setInterval(function () {
            var currentTime = new Date().getTime();
            var startTime = new Date(component.product.timedealStarttime).getTime();
            var endTime = new Date(component.product.timedealEndtime).getTime();

            if(currentTime < startTime) {
                component.saleNow = false;
                component.type = 'B';
                return;
            }
            var remaining = endTime - currentTime;
            if(remaining <= 0) {
                component.saleNow = false;
                component.type = 'E';
                return;
            }
            
            var day = Math.floor((remaining / (1000 * 60 * 60 * 24)))
            var hour = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            var minute = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
            var second = Math.floor(((remaining % (1000 * 60 * 60)) % (1000 * 60)) / (1000))

            component.timedealRemainingTime = {
                day,
                hour,
                minute,
                second
            }
            
        }, 1000);
    }
}
