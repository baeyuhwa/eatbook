// MongoDB 드라이버 로드
const { MongoClient } = require('mongodb');

// MongoDB 연결 정보
const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

// 웹 서버 설정
const express = require('express');
const app = express();

// 루트 경로에 대한 요청 처리
app.get('/', async (req, res) => {
    try {
        // MongoDB에 연결
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        // MongoDB에서 데이터를 가져옴
        const data = await db.collection('mycollection').find({}).toArray();

        // HTML 생성
        let html = '<ul>';
        data.forEach(item => {
            html += `<li>${item.name}</li>`;
        });
        html += '</ul>';

        // 응답
        res.send(html);

        // 연결 종료
        client.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 서버 시작
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});