document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired"); // 추가된 디버깅 코드
    const sendBtn = document.getElementById('send-btn');
    const loginBtn = document.getElementById('login-btn');

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    } else {
        console.log("Send button not found"); // 추가된 디버깅 코드
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', redirectToLogin);
    } else {
        console.log("Login button not found"); // 추가된 디버깅 코드
    }

    Kakao.init('8382196ca251c7706e3b7e1df97883e7'); // 여기에 카카오 앱 키를 입력하세요

    const kakaoNickname = localStorage.getItem('kakaoNickname');
    if (kakaoNickname) {
        sendBtn.style.display = 'block';
        loginBtn.style.display = 'none';
    }
});

function redirectToLogin() {
    window.location.href = '1_login.html';
}

function sendMessage() {
    console.log("Send button clicked"); // 추가된 디버깅 코드
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessage(userInput, 'user');
    document.getElementById('user-input').value = '';

    // Call KoGPT API   
    callKoGPT(userInput);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerText = text;
    document.getElementById('messages').appendChild(messageDiv);
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;  // Scroll to the bottom
}

async function callKoGPT(prompt) {
    const REST_API_KEY = '1623e8b7d8927ae0b2de2c12a304c516';

    prompt = `한 단어로 메뉴를 추천합니다.
    중식 메뉴를 추천해줘=짜장면
    일식 메뉴를 추천해줘=초밥
    한식 메뉴를 추천해줘=김치찌개
    양식 메뉴를 추천해줘=토마토 파스타
    중식 메뉴 추천해줘=짬뽕
    일식 메뉴 추천해줘=라멘
    한식 메뉴 추천해줘=된장찌개
    양식 메뉴 추천해줘=로제 파스타
    ${prompt}=`; // 이전 줄과 합치고 = 뒤에 ; 제거

    try {
        const response = await fetch('https://cors-anywhere-o5bm.onrender.com/' + 'http://api.kakaobrain.com/v1/inference/kogpt/generation', {
            method: 'POST',
            headers: {
                'Authorization': 'KakaoAK ' + REST_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 10,
                temperature: 0.6,
                top_p: 1.0,
                n: 1
            })
        });

        const data = await response.json();
        if (data.generations && data.generations.length > 0) {
            let botResponse = data.generations[0].text.split('\n')[0];
            if (botResponse) {
                botResponse = botResponse.split(', ')[0];
            }
            if (botResponse) {
                botResponse = botResponse.split(' ')[0];
            }
            addMessage(botResponse, 'bot');
        } else {
            addMessage('No response from KoGPT', 'bot');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Failed to get response from KoGPT', 'bot');
    }
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
                    web_url: 'http://www.localhost:8080',
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
