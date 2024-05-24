<?php
// MongoDB 연결 정보
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");

// 데이터를 가져올 쿼리 작성
$query = new MongoDB\Driver\Query([]);

// 데이터 조회
$cursor = $manager->executeQuery('mydatabase.mycollection', $query);

// HTML 생성
$html = '<ul>';
foreach ($cursor as $document) {
    $html .= '<li>' . $document->name . '</li>';
}
$html .= '</ul>';

// HTML 출력
echo $html;
?>
