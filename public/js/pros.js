
var app = new Vue({
    el: 'main',
    components: {

    },
    data: {
        ServiceDescType: 0,

    }, methods: {
 
        descTypeChange: function() {
            var type = $("#selectServiceDesc")[0].options.selectedIndex;
            var value = $("#selectServiceDesc").val();
            
            if(type == 1) {
                $("#ServiceDesc").removeAttr("disabled");
                $("#ServiceDesc").removeAttr("readonly");
            } else if( type > 1){
                $("#ServiceDesc").removeAttr("disabled");
                $("#ServiceDesc").attr("readonly", "");
            } else if( type == 0) {
                $("#ServiceDesc").attr("disabled", "");
            }
            $('#ServiceDesc').val(value);
        }
    
    }
});