document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    document.getElementById('login-btn').addEventListener('click', loginWithKakao);

    Kakao.init('e43c1a3ded339777a26579c4e86f07dc'); // 여기에 카카오 앱 키를 입력하세요
});

function loginWithKakao() {
    Kakao.Auth.login({
        success: function(authObj) {
            console.log(authObj);
            addMessage('Login successful!', 'bot');
            addMessage('궁금한 점에 대해서 자세히 적어주세요.\n 예시: 짜장면과 짬뽕 중에서 무엇을 먹을지 골라줘', 'bot');
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

    try {
        const response = await fetch('https://cors-anywhere-o5bm.onrender.com/' + 'http://api.kakaobrain.com/v1/inference/kogpt/generation', {
            method: 'POST',
            headers: {
                'Authorization': 'KakaoAK ' + REST_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 32,
                temperature: 1.0,
                top_p: 0.,
                n: 5
            })
        });

        const data = await response.json();
        if (data.generations && data.generations.length > 0) {
            const botResponse = data.generations[0].text.split('. ')[0];
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