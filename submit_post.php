<?php
// MySQL 연결 정보 설정
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "database_name";

// 데이터베이스 연결 생성
$conn = new mysqli("localhost", "username", "password", "dbname");

$query = "SELECT * FROM users";
$result = myaqli_query($connection, $query);

// 연결 확인
if ($conn->connect_error) {
    die("연결 실패: " . $conn->connect_error);
}

// 데이터 가져오는 SQL 쿼리
$sql = "SELECT title, content FROM posts";

// SQL 실행
$result = $conn->query($sql);

// 데이터가 있는 경우 테이블 행에 추가
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "<tr><td>" . $row["title"]. "</td><td>" . $row["content"]. "</td></tr>";
    }
} else {
    echo "0개의 결과";
}

// 데이터베이스 연결 종료
$conn->close();
?>
