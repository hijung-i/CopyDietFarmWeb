var app = new Vue({
    el: 'main',
    components: {
        'mypage-modal': signModal,
        'mypage-component': mypageComponent
    },
    data: {
        userId: '',
        password: '',
        totalPointAmount: 0,
        usableCouponAmount: 0
    }, methods: {
        login: function() {
           
            // if(this.userId == '' || this.userId == undefined || this.userId.trim() == ''){
            //     //TODO: Open alert modal
            //     alert('아이디를 입력해주세요');
            //     return false;
            // }   
            // if(this.password == '' || this.password == undefined || this.password.trim() == ''){
            //     //TODO: Open alert modal
            //     alert('비밀번호를 입력해주세요');
            //     return false;
            // } 

            // var params = {
            //     userId: this.userId,
            //     password: this.password
            // }
            // ajaxCall('/user/login', params, 'POST'
            // , function(data) {
            //     console.log('로그인 성공', data)
            // }, function(err) {
            //     console.log("login failed", err);
            //     var message = err.responseText;
            //     switch(message) {
            //     case 'NOT_MATCHED':
            //         alert('아이디 또는 비밀번호가 일치하지 않습니다.');
            //         break;
            //     case 'ERROR_SERVER':
            //         alert('알 수 없는 에러가 발생했습니다.');
            //     };
            // })
        },
        keypress: function() {

        }
    }, created: function() {
        var userId = document.getElementById('userId').value;
        this.userId = userId;
    }

})

