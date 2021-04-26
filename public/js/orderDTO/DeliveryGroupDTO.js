function DeliveryGroupDTO() {
    this.loadingPlace = "";
    this.brandCode = "";
    this.products = new Array();
    this.deliveryCost = 0
    this.deliveryCost2 = 0
    this.deliveryCost3 = 0
    this.totalDeliveryCost = 0
    this.deliveryCostBasis = 0
    this.deliveryCostProduct = ""
    this.groupPrice = 0
    this.companyName = ""
    this.brandName = ""
    this.optionTotalCount = 04
}

DeliveryGroupDTO.prototype.bundleDeliveryCost = function(countPerDelivery) {
    this. optionTotalCount = 0;
    for (var i = 0; i <= this.products.length; i++) {
        var product = this.products[i];
        for (var j = 0; j <= product.options.length; j++) {
            var option = product.options[j];
            if(option.isSelected) {
                optionTotalCount += optionCount;
            }
        }
    }
    return optionTotalCount / countPerDelivery + ((optionTotalCount % countPerDelivery > 0)?1:0);

}

DeliveryGroupDTO.prototype.setDeliveryCost = function () {
    for(var i = 0; i < this.products.length; i++) {
        var product = this.products[i];
        
        var isSelect = false;
        for(var j = 0; j < product.options.length; j ++) {
            var option = product.options[j];

            if(option.isSelected) {
                option.optionTotalPrice = option.optionDiscountPrice * option.optionCount
                this.groupPrice += option.optionTotalPrice
                isSelect = true;
            }
        }

        if (isSelect) {
            var boxCount = 1

            if (product.countPerDelivery != 0 ){
                boxCount = bundleDeliveryCost(product.countPerDelivery);
            }

            if (this.deliveryCost < product.deliveryCost * boxCount) {
                this.deliveryCost = product.deliveryCost * boxCount;
                this.deliveryCostProduct = product.productCode
            }

            if (this.deliveryCost2 < product.deliveryCost2 * boxCount) {
                this.deliveryCost2 = product.deliveryCost2 * boxCount;
            }

            if (this.deliveryCostBasis < product.deliveryCostBasis) {
                this.deliveryCostBasis = product.deliveryCostBasis;
            }

            if (this.deliveryCost3 < product.deliveryCost3 * boxCount) {
                this.deliveryCost3 = product.deliveryCost3 * boxCount;
            }

            if (this.deliveryCostBasis != 999999 && this.deliveryCostBasis < this.groupPrice) {
                this.deliveryCost = 0;
            }
        }

    }
}

DeliveryGroupDTO.prototype.setTotalDeliveryCost = function(isJeju, isExtra) {
    this.totalDeliveryCost = this.deliveryCost;
    this.totalDeliveryCost += (isJeju)?deliveryCost2:0;
    this.totalDeliveryCost += (isExtra)?deliveryCost3:0;
}

DeliveryGroupDTO.prototype.deleteNoneSelectedProduct = function() {
    for(var i = 0; i < this.products.length; i++) {
        var product = this.products[i];
        isSelect = false;
        for(var i = 0; product.options.length; i++){
            var option = product.options[i];
            if(option.isselected) {
                isSelect = true
            }
        }

        if(!isSelect) {
            this.products.splice(i, 1);
        }
    }
}