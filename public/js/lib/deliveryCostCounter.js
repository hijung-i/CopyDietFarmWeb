
function getDefaultDeliveryInfo(obj) {
    var params = {};

    ajaxCallWithLogin(API_SERVER + '/user/getDefaultDevlieryInfo', params, 'POST',
    function(data) {
        var result = data.result;
        var delivery = {
            address: result.address,
            addressName: result.addressName,
            deliveryNo: result.deliveryNo,
            userCellNo: result.userCellNo,
            userName: result.userName
        }

        obj.delivery = Object.assign({}, delivery);

        console.log("defaultDeliveryInfo success", data);
    }, function(err) {
        console.log("error", err);
        var responseText = err.responseText;
        if(responseText == 'NOT_FOUND') {
            obj.delivery = undefined
        }
    }, {
        isRequired: true,
        userId: true
    })
}

function updateDeliveryCost(deliveryGroupList, result) {
    console.log(result)
    var isJeju = false, isExtra = false;
    if(result.address.includes('제주특별자치도')) {
        isJeju = true;
    } 

    if(result.count > 0) {
        isExtra = true;
    }

    var newDeliveryGroupList = new Array();

    var totalDeliveryCost = 0;
    for(var i = 0; i < deliveryGroupList.length; i++) {
        var newDeliveryGroup = new DeliveryGroupDTO();
        var deliveryGroup = deliveryGroupList[i];

        newDeliveryGroup.products = deliveryGroup.products;
        newDeliveryGroup.loadingPlace = deliveryGroup.products[0].loadingPlace;
        newDeliveryGroup.brandCode = deliveryGroup.products[0].brandCode;
        newDeliveryGroup.companyName = deliveryGroup.products[0].companyName;
        newDeliveryGroup.brandName = deliveryGroup.products[0].brandName;
        newDeliveryGroup.setDeliveryCost(isJeju, isExtra);
        
        totalDeliveryCost += newDeliveryGroup.totalDeliveryCost;
        console.log("new delivery group ", newDeliveryGroup)
        newDeliveryGroupList.push(newDeliveryGroup);
    }

    return {
        deliveryGroupList: newDeliveryGroupList,
        totalDeliveryCost
    }
}