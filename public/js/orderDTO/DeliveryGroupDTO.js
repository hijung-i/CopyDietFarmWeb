

function DeliveryGroupDTO() {
    this.loadingPlace = "";
    this.brandCode = "";
    this.products = new Array();
    this.deliveryCost = 0
    this.deliveryCost2 = 0
    this.deliveryCost3 = 0
    this.totalDeliveryCost = 0
    this.isSelected = false
    this.deliveryCostBasis = 0
    this.deliveryCostProduct = ""
    this.groupPrice = 0
    this.companyName = ""
    this.brandName = ""
    this.optionTotalCount = 0

    this.bundleDeliveryCost = function(countPerDelivery) {
        this.optionTotalCount = 0;

        Array.from(this.products).forEach(product => {
            Array.from(product.options).forEach(option => {
                if(option.isSelected != undefined && option.isSelected) {
                    this.optionTotalCount += option.optionCount;
                } else {
                    // isSelected 가 undefined인 경우 false로 설정해줌 delete를 위함 
                    option.isSelected = false;
                }
            })
        })

        return Math.floor(this.optionTotalCount / countPerDelivery + ((this.optionTotalCount % countPerDelivery > 0)?1:0)); 
    }

    
    this.setDeliveryCost = function (isJeju, isExtra) {
        this.groupPrice = 0;
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
                var boxCount = 1;

                if (product.countPerDelivery != 0 ){
                    boxCount = this.bundleDeliveryCost(product.countPerDelivery);
                }
                if (this.deliveryCost < product.deliveryCost * boxCount) {
                    this.deliveryCost = product.deliveryCost * boxCount;
                    this.deliveryCostProduct = product.productCode
                }

                if (this.deliveryCost2 < product.deliveryCost2 * boxCount) {
                    this.deliveryCost2 = product.deliveryCost2 * boxCount;
                    this.deliveryCostProduct = product.productCode;
                }

                if (this.deliveryCostBasis < product.deliveryCostBasis) {
                    this.deliveryCostBasis = product.deliveryCostBasis;
                }

                if (this.deliveryCost3 < product.deliveryCost3 * boxCount) {
                    this.deliveryCost3 = product.deliveryCost3 * boxCount;
                    this.deliveryCostProduct = product.productCode;
                }

                if (this.deliveryCostBasis != 999999 && this.deliveryCostBasis < this.groupPrice) {
                    this.deliveryCost = 0;
                }
            }
            
        }
        this.setTotalDeliveryCost(isJeju, isExtra);
    }

    
    this.setTotalDeliveryCost = function(isJeju, isExtra) {
        this.totalDeliveryCost = this.deliveryCost;
        this.totalDeliveryCost += (isJeju) ? this.deliveryCost2 : 0;
        this.totalDeliveryCost += (isExtra) ? this.deliveryCost3 : 0;
    }

    this.deleteNoneSelectedProduct = function() {
        var selectedProducts = new Array();
        
        for(var i = 0; i < this.products.length; i++) {
            var product = this.products[i];
            var selectedOptions = new Array();
        
            for(var j = 0; j < product.options.length; j++){
                var option = product.options[j];
                if(option.isSelected) {
                    selectedOptions.push(option);
                }
            }
            
            if(selectedOptions.length > 0) {
                product.options = selectedOptions;
                selectedProducts.push(product);

            }
            
        }
        this.products = selectedProducts;
    }

    this.cloneObject = function () {
        var clone = Object.assign({}, this)
        clone.setDeliveryCost = this.setDeliveryCost
        clone.setTotalDeliveryCost = this.setTotalDeliveryCost
        clone.bundleDeliveryCost = this.bundleDeliveryCost
        clone.deleteNoneSelectedProduct = this.deleteNoneSelectedProduct

        return clone;
    }

}