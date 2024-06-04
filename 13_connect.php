<?php
$servername = "localhost";
$username = "root";
$password = "0000";
$dbname = "eatbook";

// MySQL 데이터베이스 연결 생성
$conn = new mysqli($servername, $username, $password, $dbname);

// 연결 상태 확인
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
