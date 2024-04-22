window.onload = function() {
    const form = document.getElementById('signup');
    form.addEventListener('submit', signButton);
}

function signButton(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const id = document.getElementById('id').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (!(password.length >= 8)) {
        alert('8자리 이상의 비밀번호를 입력해주세요.');
        return; 
    }
    const phonePattern = /^\d{11}$/; // 11자리의 숫자로 이루어진 문자열
    if (!phonePattern.test(phone)) {
        alert('전화번호를 올바르게 입력해주세요.');
        return; // 함수 종료
    }

    console.log('이름:', username);
    console.log('아이디:', id);
    console.log('비밀번호:', password);
    console.log('이메일:', email);
    console.log('전화번호:', phone);
}