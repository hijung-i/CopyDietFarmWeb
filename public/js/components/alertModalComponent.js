var alertModalTemplate = ''

alertModalTemplate += '<div class="alert-modal modal-overlay">';
alertModalTemplate += '    <div class="modal-content">';
alertModalTemplate += '        <h3>{{ alert.title }}</h3>';
alertModalTemplate += '        <p v-html="alert.content"></p>';

alertModalTemplate += '        <div class="buttons" v-if="alert.buttonType === \'CONFIRM\'">'
alertModalTemplate += '             <button class="confirm" @click="onConfirm()">확인</button>';
alertModalTemplate += '             <button class="cancel" @click="onCancel()">취소</button>';
alertModalTemplate += '        </div>';

alertModalTemplate += '        <div class="buttons" v-if="alert.buttonType === \'NONE\'">'
alertModalTemplate += '             <button class="cancel" @click="onCancel()">확인</button>';
alertModalTemplate += '        </div>';

alertModalTemplate += '    </div>';
alertModalTemplate += '</div>';

var AlertModalComponent = {
    template: alertModalTemplate,
    props: {
        alert: {
            type: Object,
            default: function() {
                return {
                    title: '',
                    content: '',
                    buttonType: 'NONE',
                    callback: undefined
                }
            }
        },
        
    },
    data: function(){
        return {
            callback: this.alert.callback
        }
    }, methods: {
        closeModal: function () {
            app.alertModalShow = false;
            scrollAllow();
        },
        onConfirm: function() {
            if(this.callback != undefined) {
                this.callback();
            }

            this.closeModal();
        },
        onCancel: function() {
            this.closeModal();
        }
    }
}

function openAlertModal() {
    app.alertModalShow = true;
}