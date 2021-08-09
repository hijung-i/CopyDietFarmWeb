var nothing = ''
var validNumber = '01055431787'
var invalidNumber = '01234567890';
var invalidNumber2 = 'dataflow0901';

console.log(telValid(nothing))
console.log(telValid(validNumber))
console.log(telValid(invalidNumber))
console.log(telValid(invalidNumber2))

function telValid(userCellNo) {

    if(/^[0-9]{2,3}[0-9]{3,4}[0-9]{4}/.test(userCellNo)) {
        console.log('valid');
        return true
    } else {
        console.log('invalid')
        // 형식이 잘못되었다면 입력받도록 함
        return false;
        // this.orderDTO.userCellNo = undefined
    }
}