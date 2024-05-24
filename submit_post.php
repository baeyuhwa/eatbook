<?php
// MySQL 연결 정보 설정
$servername = "localhost";
$username = "root";
$password = "0000";
$dbname = "eatbook";

// 데이터베이스 연결 생성
$conn = new mysqli($servername, $username, $password, $dbname);

// 연결 확인
if ($conn->connect_error) {
    die("연결 실패: " . $conn->connect_error);
}

// 폼 데이터 가져오기
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $_POST['title'];
    $content = $_POST['content'];

    // SQL 쿼리 작성 및 실행
    $sql = "INSERT INTO posts (title, content) VALUES ('$title', '$content')";

    if ($conn->query($sql) === TRUE) {
        echo "새 게시글이 성공적으로 작성되었습니다.";
    } else {
        echo "오류: " . $sql . "<br>" . $conn->error;
    }
}

// 데이터베이스 연결 종료
$conn->close();
?>
