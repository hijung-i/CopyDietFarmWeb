var imageModalTemplate = '';

imageModalTemplate += '<div class="img_modal" id="img_Modal" style="display:none">'
imageModalTemplate += '<div class="img-modal-content"  v-bind:style="{ width: ((review.files.length * 110) - 10) }">'
imageModalTemplate += '    <span class="close" onclick="closeimgModal();">&times;</span>'
imageModalTemplate += '    <img v-bind:src="RESOURCE_SERVER + image.url" style="width:300px;" v-for="image in review.files">'
imageModalTemplate += '</div>'
imageModalTemplate += '</div>'

var imageModalComponent = {
    template: imageModalTemplate,
    props: {
        image: {
            type: Object,
            default: function() {
                return {
                   
                }
            }
        },
        
    },
    data: function(){
      
    }, methods: {
        closeimageModal: function () {
            app.imageModalShow = false;
            scrollAllow();
        },
    }
}

function openimgModal() {
    app.imageModalShow = true;
}