$(function() {
    getProductDetail();
})

function getProductDetail(){
    var productCode = $("#productCode").val();

    var params = {
        productCode: productCode
    }

    ajaxCallWithLogin(API_SERVER + '/product/productDetail', params, 'POST'
    , function (data) {
        console.log("productDetail success", data);
    }, function (err) {
        console.log("productDetail error", err);
    }, {
        isRequired: false,
        userId : true
    })
}