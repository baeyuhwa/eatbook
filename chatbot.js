document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    document.getElementById('login-btn').addEventListener('click', loginWithKakao);

    Kakao.init('0b186f985c794d65bc579d504a9a6dc4'); // 여기에 카카오 앱 키를 입력하세요
});

function loginWithKakao() {
    Kakao.Auth.login({
        success: function(authObj) {
            console.log(authObj);
            addMessage('Login successful!', 'bot');
        },
        fail: function(err) {
            console.log(err);
            addMessage('Login failed!', 'bot');
        }
    });
}

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessage(userInput, 'user');
    document.getElementById('user-input').value = '';

    // Call Kakao API
    KakaoTalkChat(userInput);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerText = text;
    document.getElementById('messages').appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

function KakaoTalkChat(message) {
    if (!Kakao.Auth.getAccessToken()) {
        addMessage('You need to login first.', 'bot');
        return;
    }

    Kakao.API.request({
        url: '/v2/api/talk/memo/default/send',
        data: {
            template_object: {
                object_type: 'text',
                text: message,
                link: {
                    web_url: 'http://localhost:8085',
                    mobile_web_url: 'http://yourwebsite.com'
                }
            }
        },
        success: function(response) {
            addMessage('Your message has been sent!', 'bot');
        },
        fail: function(error) {
            addMessage('Failed to send message.', 'bot');
            console.log(error);
        }
    });
}
