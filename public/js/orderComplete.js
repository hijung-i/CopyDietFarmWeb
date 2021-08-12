$(function() {
    
    var products = JSON.parse($('#products').val());
    console.log(products);

    if( products[0].options[0].cartNo != undefined) {
        console.log('장바구니 구매')
        var params = {
            products
        }

        ajaxCallWithLogin(API_SERVER + '/order/deleteCart', params, 'POST',
        function(data) {
            console.log('장바구니에서 삭제');
            console.log(data);
        }, function(err) {
            console.error(err);
        }, {
            isRequired: true,
            userId: true
        });
    }
    gtag('event', 'conversion', {
        'send_to': 'AW-693713323/-076CISNqeYCEKvz5MoC',
        'transaction_id': ''
    });
    
})

