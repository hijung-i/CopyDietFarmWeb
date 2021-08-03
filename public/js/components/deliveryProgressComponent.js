
var deliveryProgressTemplate = '';

var deliveryProgress = {
    template: deliveryProgressTemplate,
    props: {
        delivery: {
            type: Object,
            default: function() { 
                return {
                    deliveryNo: 0
                }
            }
        }
    },
    data: function() {
    }, methods: {
        
    }
}