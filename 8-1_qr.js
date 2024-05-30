document.addEventListener('DOMContentLoaded', function() {
    // 페이지 URL 가져오기
    const pageURL = window.location.href;
    // QR 코드 생성 및 표시
    const qrCode = new QRCode(document.getElementById("qrcode"), {
        text: pageURL,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H // 오류 정정 레벨 설정
    });
});
