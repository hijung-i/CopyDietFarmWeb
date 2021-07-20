
function getDefaultDeliveryInfo(app) {
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

        app.orderDTO.delivery = delivery;
    
        checkDeliveryAddress(app)
        console.log("defaultDeliveryInfo success", data);
    }, function(err) {
        console.log("error", err);
        var responseText = err.responseText;
        if(responseText == 'NOT_FOUND') {
            app.delivery = undefined
        }
    }, {
        isRequired: true,
        userId: true
    })
}

function updateDeliveryCost(deliveryGroupList, result, app) {
    console.log(result)
    isJeju = false;
    isExtra = false;
    if(result.address.includes('제주특별자치도')) {
        isJeju = true;
    }

    if(result.count > 0) {
        isExtra = true;
    }

    var totalDeliveryCost = 0;
    Array.from(deliveryGroupList).forEach(deliveryGroup => {
        totalDeliveryCost += deliveryGroup.deliveryCost;

        if(isJeju) totalDeliveryCost += deliveryGroup.deliveryCost2
        if(isExtra) totalDeliveryCost += deliveryGroup.deliveryCost3
    })

    return totalDeliveryCost
}


function checkDeliveryAddress(app) {
    var params = {
        deliveryNo: app.orderDTO.delivery.deliveryNo
    };
    
    ajaxCallWithLogin(API_SERVER + '/user/checkDeliveryAddress', params, 'POST',
    function(data) {
        var result = data.result;
        var totalDelivertCost = updateDeliveryCost(app.deliveryGroupList, result, app);

        app.orderDTO.totalDeliveryCost = totalDelivertCost
    }, function(err) {
        console.log("error", err);
    }, {
        isRequired: true,
        userId: true
    })
}