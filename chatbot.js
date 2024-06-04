document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    document.getElementById('login-btn').addEventListener('click', loginWithKakao);

    Kakao.init('e43c1a3ded339777a26579c4e86f07dc'); // 여기에 카카오 앱 키를 입력하세요
});

function loginWithKakao() {
    Kakao.Auth.login({
        success: function(authObj) {
            console.log(authObj);
            addMessage('로그인이 완료되었습니다.', 'bot');
            addMessage('메뉴가 고민된다면 추천 받아보세요.', 'bot');
            addMessage('예시: 점심 메뉴를 추천해줘', 'bot');
            document.getElementById('send-btn').style.display = 'block';
            document.getElementById('login-btn').style.display = 'none';
        },
        fail: function(err) {
            console.log(err);
            addMessage('로그인 실패', 'bot');
        }
    });
}

function sendMessage() {
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
    messageDiv.scrollIntoView({ behavior: 'smooth' });
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
    ${prompt}=`;

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