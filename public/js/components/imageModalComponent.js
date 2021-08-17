var imageModalTemplate = '';

imageModalTemplate += '<div class="img_modal" id="img_Modal">'
imageModalTemplate += '    <div class="img-modal-content">'
imageModalTemplate += '        <span class="close" v-on:click="closeImageModal();">&times;</span>'
imageModalTemplate += '        <img v-if="currentImage != undefined" v-bind:src="RESOURCE_SERVER + currentImage.url" style="width:300px;">'
imageModalTemplate += '    </div>'
imageModalTemplate += '</div>'

var ImageModalComponent = {
    template: imageModalTemplate,
    props: {
        targetObject: {
            type: Object,
            default: function() {
                return { files: [] }
            }
        },
        initialIndex: {
            type: Number,
            default: function() {
                return 0
            }
        }
    },
    data: function(){
        return { 
            RESOURCE_SERVER,
            currentIndex: this.initialIndex
        }
    }, computed: {
        currentImage: function() {
            return this.targetObject.files[this.currentIndex]
        }
    }, methods: {
        closeImageModal: function () {
            app.imageModalShow = false;
            scrollAllow();
        }, previousImage: function () {
            this.currentIndex = ((this.currentIndex - 1) > 0)? this.currentIndex - 1 : 0;
        }, nextImage: function() {
            this.currentIndex = ((this.currentIndex + 1 ) < this.targetObject.files.length - 1)? this.currentIndex + 1 : this.targetObject.files.length - 1;
        }
    }, mounted: function() {
        console.log(this.targetObject, this.initialIndex);
    }
}

function openimgModal() {
    app.imageModalShow = true;
}