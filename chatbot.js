// chatbot.js

// 카카오톡 API 키
const KAKAO_API_KEY = '7b4c43469892854149d653f502531e2f'; // 여기에 본인의 카카오톡 API 키를 입력하세요

// 사용자가 보낸 메시지를 받는 함수
async function receiveMessage(user_key, message) {
    console.log(`Received message from ${user_key}: ${message}`);

    // 여기에 챗봇 로직을 구현합니다.
    // 받은 메시지에 따라 응답을 생성하고, 카카오톡 API를 사용하여 사용자에게 메시지를 보냅니다.

    // 예시: 사용자가 보낸 메시지를 그대로 다시 보내기
    await sendMessage(user_key, message);
}

// 카카오톡 메시지를 보내는 함수
async function sendMessage(user_key, message) {
    console.log(`Sending message to ${user_key}: ${message}`);

    const API_URL = 'https://kapi.kakao.com/v2/api/talk/memo/default/send';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${KAKAO_API_KEY}`
    };

    const data = {
        template_object: JSON.stringify({
            object_type: 'text',
            text: message,
            link: {
                web_url: 'https://your-website-url.com',
            },
        }),
        receiver_uuids: [`kakaotalk:${user_key}`],
    };

    try {
        const response = await axios.post(API_URL, data, { headers });
        if (response && response.data) {
            console.log('Message sent successfully:', response.data);
        } else {
            console.error('Error sending message: Response or data is undefined');
        }
    } catch (error) {
        console.error('Error sending message:', error.response.data);
    }
}


// 챗봇을 시뮬레이션하기 위해 사용자가 보낸 메시지를 받아 처리합니다.
async function simulateChat() {
    // 사용자가 보낸 메시지
    const user_key = 'test_user';
    const message = '안녕하세요. 반가워요!';

    // 메시지를 받아 처리하는 함수 호출
    await receiveMessage(user_key, message);
}

// 시뮬레이션 실행
simulateChat();
